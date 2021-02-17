/************************
* Custom dan commands
*************************/
module.exports = {
   name: 'dan',
   execute(message, emojis) {
      if ((message.content.toLowerCase().includes('blow up') || message.content.toLowerCase().includes('explode') ||
      message.content.toLowerCase().includes('remove') || message.content.toLowerCase().includes('delete') ||
      message.content.toLowerCase().includes('destroy') || message.content.toLowerCase().includes('obliterate') ||
      message.content.toLowerCase().includes('annihilate') || message.content.toLowerCase().includes('eviscerate') ||
      message.content.toLowerCase().includes('eradicate') || message.content.toLowerCase().includes('bomb') || 
      message.content.toLowerCase().includes('nuke')) &&
      (message.content.toLowerCase().includes('planet') || message.content.toLowerCase().includes('earth'))) {
         message.channel.send('https://media.discordapp.net/attachments/480825101231718421/717473201361256448/DBZ_Resurrection_F_Earth_Blows_Up.gif');
      }
   }
}
