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
const logger = require('winston');

/***************************************
* Configure logger settings            *
****************************************/
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
   colorize: true,
});
logger.level = 'debug';

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
if (process.argv[2] === 'debug') console.log(client.commands);
if (process.argv[2] === 'debug') console.log(client.triggers);

client.on('ready', () => {
   console.log(`Logged in as ${client.user.tag}!`);
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
   const workingToday = (holiday) => {
      if(holiday) {
         channels.channelNormalChat.send(`Are any of you working today? It's ${holiday}`);
      } else {
         console.log("Today is not a holiday")
      }
   };
   const fetch7d2dUpdates = () => {
      channels.channel7d2d.messages.fetch()
      .then(messages => {
         const latestUpdate = messages.filter(m => m.author.bot).values().next().value.embeds[0].title;
         const newUpdate = update => {
            if (update.title != '' && latestUpdate != update.title) {
               let newsEmbed = new Discord.MessageEmbed()
                  .setColor('#ebc40f')
                  .setTitle(update.title)
                  .setURL(update.link)
                  .setDescription(update.description)
                  .setImage('https://7daystodie.com/images/header_g.png')
                  .setFooter('Provided to you by Airhorn Bot');
               channels.channel7d2d.send(newsEmbed);
            }
         };
         updates7d2d(newUpdate);
      });
   }
   cron.schedule(morning_cron, () => {
      workingToday(todayHoliday());
      console.log('MORNING CRON SUCCESS');
   });
   cron.schedule(evening_cron, () => {
      fetch7d2dUpdates();
      console.log('EVENING CRON SUCCESS');
   });

   // TEST CRON JOB: ONLY UNCOMMENT WHEN DEBUGGING AND KILL UPON FIRST EXECUTION
   if (process.argv[2] === 'debug' && process.argv[3] === 'cron') {
      cron.schedule('* * * * * *', () => {
         //...something to test here
      }); 
   }

});


client.on('message', message => {
   if (process.argv[2] === 'debug') console.log(`${message.author.username}: ${message}`); // debug param shows all messages
   const args = message.content.slice(prefix.length).trim().split(/ +/);
   const command = args.shift().toLowerCase();

   /***************************************
   * STEVE ONLY
   ****************************************/
   if (message.author.id === process.env.STEVE_ID) {
      try {
         client.triggers.get('steve').execute(message, emojis);
      } catch (error) {
         console.log(error);
      }
   }

   /***************************************
   * KEVIN ONLY
   ****************************************/
   if (message.author.id === process.env.KEVIN_ID) {
      try {
         client.triggers.get('kevin').execute(message, emojis);
      } catch (error) {
         console.log(error);
      }
   }

   /***************************************
   * DAN ONLY
   ****************************************/
   if (message.author.id === process.env.DAN_ID) {
      try {
         client.triggers.get('dan').execute(message);
      } catch (error) {
         console.log(error);
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
      console.log(error);
   }


   /*******************************************************
   * Execute a command if it matches the list of commands
   * Exit if text not in list
   ********************************************************/
   if (!client.commands.has(command)) return;

   try {
      client.commands.get(command).execute(message, args, emojis);
   } catch (error) {
      console.log(error);
   }
   
});

client.login(process.env.AUTH_TOKEN);
