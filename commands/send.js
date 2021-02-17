/***********************************************
* !send channelID message
* Send a message via the bot to a given channel
************************************************/
module.exports = {
   name: 'send',
   description: 'Send a message via the bot to a given channel',
   usage: '!send channelID message',
   execute(message, args) {
      if (args.length < 2) {
         return message.reply(`You didn't provide enough arguments. Usage: '!send channelID message'`);
      } else if (args.length >= 2) {
         let sendMessage = '';
         for (let i=1; i<args.length; i++){
            sendMessage += args[i];
            if (i < args.length-1) sendMessage += ' ';
         }
         console.log(`channel: ${args[0]}, message: ${sendMessage}`);
         const channel = message.client.channels.cache.get(args[0]);
         channel.send(sendMessage);
      }
   }
}
