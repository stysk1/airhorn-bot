/***************************************
* Dependencies
****************************************/
require('dotenv').config();

const { channels } = require('./lib/channels.js');
const { emojis } = require('./lib/emojis.js');
const { updates7d2d } = require('./scripts/7d2d.js');
const { fetchHoliday, todayHoliday } = require('./scripts/holidays.js');
const { prefix, morning_cron, evening_cron } = require('./config.json');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.triggers = new Discord.Collection();

const fs = require('fs');
const cron = require('node-cron');
const logger = require('./logger');

const db = require('./db');

/***************************************
* Preload client commands and triggers *
****************************************/
const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commands) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.name, command);
}
const triggers = fs.readdirSync('./triggers').filter(file => file.endsWith('.js'));
for (const file of triggers) {
   const trigger = require(`./triggers/${file}`);
   if (trigger instanceof Array) {
      client.triggers.set('textTriggers', trigger);
   } else {
      client.triggers.set(trigger.name, trigger);
   }
}
if (process.argv[2] === 'debug') logger.debug(client.commands);
if (process.argv[2] === 'debug') logger.debug(client.triggers);

client.on('ready', () => {
   logger.info(`Logged in as ${client.user.tag}!`);
   client.user.setActivity('with binary', {type: 'PLAYING'});

   /***************************************
   * Channel Import                       *
   ****************************************/
   channels.execute(client.channels);

   /***************************************
   * Custom Emoji Import                  *
   ****************************************/
   emojis.execute(client.emojis);

   /******************************************************
   * Configure cron jobs for morning and evening updates *
   *******************************************************/
   const workingToday = holiday => {
      channels.chattyMcChatFace.send(`Are any of you working today? It's ${holiday}`);
   };
   const fetch7d2dUpdates = () => {
      if (!channels.channel7d2d) {
         console.warn('fetch7d2dUpdates: channel7d2d is not set, skipping');
         return;
      }
      channels.channel7d2d.messages.fetch()
      .then(messages => {
         const lastBotMsg = messages.filter(m => m.author.bot).first();
         const latestUpdate = (lastBotMsg && lastBotMsg.embeds && lastBotMsg.embeds[0])
            ? lastBotMsg.embeds[0].title
            : null;
         const newUpdate = update => {
            if (update.title && update.title !== latestUpdate) {
               let newsEmbed = new Discord.MessageEmbed()
                  .setColor('#ebc40f')
                  .setTitle(update.title)
                  .setURL(update.link)
                  .setDescription(update.description)
                  .setImage('https://7daystodie.com/images/header_g.png')
                  .setFooter('Provided to you by Airhorn Bot');
               channels.channel7d2d.send(newsEmbed)
                  .catch(err => console.error('Failed to send 7d2d embed:', err));
            }
         };

         updates7d2d(newUpdate);
      })
      .catch(err => console.error('fetch7d2dUpdates failed:', err));
   }
   cron.schedule(morning_cron, () => { 
      todayHoliday(workingToday);
      fetch7d2dUpdates();
      logger.debug('MORNING CRON SUCCESS');
   });
   cron.schedule(evening_cron, () => {
      todayHoliday(workingToday);
      fetch7d2dUpdates();
      logger.debug('EVENING CRON SUCCESS');
   });

   // TEST CRON JOB: ONLY UNCOMMENT WHEN DEBUGGING AND KILL UPON FIRST EXECUTION
   if (process.argv[2] === 'debug' && process.argv[3] === 'cron') {
      cron.schedule('* * * * * *', () => {
         //...something to test here
      }); 
   }

});


client.on('message', message => {
   if (process.argv[2] === 'debug') logger.debug(`${message.author.username}: ${message}`); // debug param shows all messages
   const args = message.content.slice(prefix.length).trim().split(/ +/);
   const command = args.shift().toLowerCase();

   /***************************************
   * STEVE ONLY
   ****************************************/
   if (message.author.id === process.env.STEVE_ID) {
      try {
         client.triggers.get('steve').execute(message, emojis);
      } catch (error) {
         logger.error(error);
      }
   }

   /***************************************
   * KEVIN ONLY
   ****************************************/
   if (message.author.id === process.env.KEVIN_ID) {
      try {
         client.triggers.get('kevin').execute(message, emojis);
      } catch (error) {
         logger.error(error);
      }
   }

   /***************************************
   * DAN ONLY
   ****************************************/
   if (message.author.id === process.env.DAN_ID) {
      try {
         client.triggers.get('dan').execute(message);
      } catch (error) {
         logger.error(error);
      }
   }

   /***************************************
   * NICK ONLY
   ****************************************/
   if (message.author.id === process.env.NICK_ID) {
      try {
         client.triggers.get('nick').execute(message);
      } catch (error) {
         logger.error(error);
      }
   }


   /***************************************
   * All misc text based triggers
   ****************************************/
   try {
      for(const trigger of client.triggers.get('textTriggers')) {
         trigger.execute(message, emojis);
      }
   } catch (error) {
      logger.error(error);
   }


   /*******************************************************
   * Execute a command if it matches the list of commands
   * Exit if text not in list
   ********************************************************/
   if (!client.commands.has(command)) return;

   try {
      client.commands.get(command).execute(message, args, emojis);
   } catch (error) {
      logger.error(error);
   }
   
});

client.login(process.env.AUTH_TOKEN);
