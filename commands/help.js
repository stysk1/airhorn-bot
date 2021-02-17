/***********************************************
* !help
* Show the available commands to use
************************************************/
module.exports = {
   name: 'help',
   description: 'Show the available commands to use',
   usage: '!help',
   execute(message) {
      message.reply(`I don't help mere mortals ${avgnfuckyou}`);
   }
}
