/************************
* Custom dan commands
*************************/
const priceRegex = /\$?(?:[1-9](?:\.\d{1,2})?)\b/; // Matches prices like $3.25 or 3.25
const db = require('../db');
const logger = require('../logger');

module.exports = {
   name: 'dan',
   async execute(message, emojis) {
      const content = message.content.toLowerCase();

      // Earth destruction trigger
      if (
         (content.includes('blow up') || content.includes('explode') ||
         content.includes('remove') || content.includes('delete') ||
         content.includes('destroy') || content.includes('obliterate') ||
         content.includes('annihilate') || content.includes('eviscerate') ||
         content.includes('eradicate') || content.includes('bomb') || 
         content.includes('nuke')) &&
         (content.includes('planet') || content.includes('earth'))
      ) {
         message.channel.send('https://media.discordapp.net/attachments/480825101231718421/717473201361256448/DBZ_Resurrection_F_Earth_Blows_Up.gif');
      }

      // Gas price tracking trigger
      if (content.toLowerCase().startsWith("i got gas")) {
         const match = message.content.match(priceRegex);
         if (match) {
            const price = parseFloat(match[0].replace('$', ''));
            const publishedAt = message.createdAt.toISOString().slice(0, 19).replace('T', ' '); // SQL timestamp format

            try {
               await db.query(`
                  INSERT INTO gasprices (price, published_at)
                  VALUES ($1, $2)
               `, [price, publishedAt]);

               console.log(`Inserted $${price} gas price from ${publishedAt} into the database`);
               message.channel.send(`Added $${price} gas price into the database`);
            } catch (err) {
               console.error("Error inserting gas price into DB:", err);
            }
         }
      }
   }
};
