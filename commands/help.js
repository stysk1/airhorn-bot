/***********************************************
* !help
* Show the available commands to use
************************************************/
module.exports = {
   name: 'help',
   description: 'Show the available commands to use',
   usage: '!help',
   execute(message, args, emojis) {
      message.reply(`I don't help mere mortals ${emojis.avgnfuckyou}`);
   }
}
