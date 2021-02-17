/************************
* Custom kevin commands
*************************/
module.exports = {
   name: 'kevin',
   execute(message, emojis) {
      if (message.content.toLowerCase().includes('kevin')) {
      message.react(emojis.kelso)
         .then(() => message.channel.send("The true Kelsoreaper"))
         .catch(() => console.error('A most unfortunate series of events'))
      }
   }
}
