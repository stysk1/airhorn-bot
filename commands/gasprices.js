require('dotenv').config();
const logger = require('../logger');
const Storable = require('../lib/storable.js');
const db = require('../db');

module.exports = {
   name: 'gasprices',
   description: 'Finds gas prices from Dan’s messages',
   usage: '!gasprices [historical]',
   async execute(message, args, emojis) {
      const isHistorical = args.includes('historical');

      message.channel.send("⏳ Fetching gas prices in the background... I'll let you know when it's done!");

      setTimeout(async () => {
         await fetchAndProcessGasPrices(message, isHistorical);
      }, 1000);
   }
};

function toSQLTimestampUTC(date) {
   const pad = n => String(n).padStart(2, '0');
   return `${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

async function fetchAndProcessGasPrices(message, isHistorical = false) {
   const DAN_ID = process.env.DAN_ID;
   const priceRegex = /\$?(?:[1-9](?:\.\d{1,2})?)\b/;
   const channel = await message.client.channels.cache.get(process.env.CHANNEL_NORMALCHAT);
   let gasPrices = [];
   let totalFetched = 0;

   // First, if `historical` flag is passed, scan messages and insert only missing records
   if (isHistorical) {
      logger.info('🔍 Looking through historical messages to add missing records...');
      const existingTimestamps = new Set();
      const dbRows = await db.query('SELECT published_at FROM gasprices');
      dbRows.rows.forEach(row => {
         existingTimestamps.add(toSQLTimestampUTC(new Date(row.published_at)));
      });

      let lastID = null;
      let keepFetching = true;
      let totalFetched = 0;

      while (keepFetching) {
         const fetchedMessages = await channel.messages.fetch({
            limit: 100,
            ...(lastID && { before: lastID }),
         });

         if (fetchedMessages.size === 0) {
            logger.debug('🛑 No more messages to fetch.');
            break;
         }

         totalFetched += fetchedMessages.size;
         const lastMessage = fetchedMessages.last();
         if (!lastMessage) break;
         lastID = lastMessage.id;

         for (const msg of fetchedMessages.values()) {
            if (msg.author.id === DAN_ID && msg.content.includes("I got gas")) {
               const match = msg.content.match(priceRegex);
               if (match) {
                  const price = parseFloat(match[0].replace('$', ''));
                  const createdAt = msg.createdAt;
                  const createdAtKey = toSQLTimestampUTC(createdAt);

                  if (createdAt < new Date('2025-01-01')) {
                     keepFetching = false;
                     logger.debug(`🛑 Hit cutoff date at ${sqlTimestamp}`);
                     break;
                  }

                  // Avoid inserting duplicate timestamps
                  if (!existingTimestamps.has(createdAtKey)) {
                     const createdAtSQL = createdAtKey.slice(0, 19).replace('T', ' ');
                     await db.query(`
                        INSERT INTO gasprices (price, published_at)
                        VALUES ($1, $2)
                     `, [price, createdAtSQL]);

                     logger.info(`✅ Inserted $${price} gas price from ${createdAtSQL} into the database`);
                     existingTimestamps.add(createdAtKey);
                  }
               }
            }
         }

         lastID = fetchedMessages.last().id;
         totalFetched += fetchedMessages.size;

         // Optional stopping point if your history doesn't go further back
         // const oldestMessage = fetchedMessages.last()?.createdAt;
         // if (oldestMessage && oldestMessage < new Date('2025-01-01')) {
         //    logger.debug(`🛑 Stopping fetch at ${oldestMessage}`);
         //    break;
         // }
      }

      logger.info(`📜 Historical scan complete. Total messages scanned: ${totalFetched}`);
   }

   // Now pull everything from the DB
   const { rows } = await db.query('SELECT price, published_at FROM gasprices ORDER BY published_at ASC');
   if (rows.length === 0) {
      return message.channel.send("⚠️ No gas price records found.");
   }

   rows.forEach(row => {
      const { price, published_at } = row;
      gasPrices.push({ price: parseFloat(price), date: new Date(published_at) });
   });

   // Stats Calculations
   gasPrices.sort((a, b) => a.price - b.price);
   const minPrice = gasPrices[0];
   const maxPrice = gasPrices[gasPrices.length - 1];
   const medianPrice =
      gasPrices.length % 2 === 0
         ? (gasPrices[gasPrices.length / 2 - 1].price + gasPrices[gasPrices.length / 2].price) / 2
         : gasPrices[Math.floor(gasPrices.length / 2)].price;
   const averagePrice = (gasPrices.reduce((sum, g) => sum + g.price, 0) / gasPrices.length).toFixed(2);

   const last4 = gasPrices.slice(-4).map(g => g.price);
   let trend = "Unknown";
   if (last4.length === 4) {
      trend = last4[0] < last4[1] && last4[1] < last4[2] && last4[2] < last4[3] ? "⬆️ Increasing"
            : last4[0] > last4[1] && last4[1] > last4[2] && last4[2] > last4[3] ? "⬇️ Decreasing"
            : "➖ Stable/Fluctuating";
   }

   let response = `📊 **Gas Price Stats** 📊\n\n`;
   response += `🟢 **Min Price:** $${minPrice.price} on ${minPrice.date.toDateString()}\n`;
   response += `🔴 **Max Price:** $${maxPrice.price} on ${maxPrice.date.toDateString()}\n`;
   response += `⚖️ **Median Price:** $${medianPrice.toFixed(2)}\n`;
   response += `📉 **Average Price:** $${averagePrice}\n`;
   response += `📈 **Trend (Last 4):** ${trend}`;

   message.channel.send(response);
}
