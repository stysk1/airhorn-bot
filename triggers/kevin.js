/************************
* Custom kevin commands
*************************/
const priceRegex = /\$\d+(\.\d{1,2})?/; // Matches prices like $3.25 or 3.25
const db = require('../db');
const logger = require('../logger');

module.exports = {
   name: 'kevin',
   async execute(message, emojis) {
      if (message.content.toLowerCase().includes('kevin')) {
      message.react(emojis.kelso)
         .then(() => message.channel.send("The true Kelsoreaper"))
         .catch(() => console.error('A most unfortunate series of events'))
      }
   }
}
