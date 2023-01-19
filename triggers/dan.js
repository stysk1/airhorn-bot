/************************
* Custom dan commands
*************************/
module.exports = {
   name: 'dan',
   execute(message) {
      const keywords = ["annihilate", "blight", "blow up", "bomb", "break up", "burst", "damage", "dash", "delete", "demolish", "detonate", "destroy", "dynamite", "eradicate", "eviscerate", "explode", "injure", "kill", "obliterate", "remove", "ruin", "shatter", "shrivel", "spoil", "stunt", "torpedo", "up", "wither", "wreck"];
      const targets = ["planet", "earth", "world", "globe", "sphere"];
      const messageContent = message.content.toLowerCase();

      if (keywords.some(keyword => messageContent.includes(keyword)) && targets.some(target => messageContent.includes(target))) {
         message.channel.send('https://media.discordapp.net/attachments/480825101231718421/717473201361256448/DBZ_Resurrection_F_Earth_Blows_Up.gif');
      }
   }
}
