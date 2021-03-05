/*************************************************************************
* !rants
* Post how many Dan rants there are\
**************************************************************************/
require('dotenv').config();
const Storable = require('../lib/storable.js');
module.exports = {
   name: 'rants',
   description: 'Post how many Dan rants there are',
   usage: '!rants',
   async execute(message, args, emojis) {
      let messages = [];
      let rants = [];
      let lastID;
      while(true){
         const fetchedMessages = await message.channel.messages.fetch({
            limit: 100,
            ...(lastID && {before: lastID }),
         });
         if (fetchedMessages.size === 0) {
            messages = messages.filter(m => m.author.id === process.env.DAN_ID).filter(c => c.content.length > 650);
            break;
         }
         messages = messages.concat(Array.from(fetchedMessages.values()));
         lastID = fetchedMessages.lastKey();
      }
      for (const rant of messages) {
         rants.push(rant.content);
      }
      message.channel.send(`Dan's rant count = ${rants.length}`);
      const store = new Storable(rants);
      const author = message.author;
      console.log(store.data);
      message.channel.send(store.toEmbed())
      .then(message => store.react(message, author))
      .catch(error => console.error(`Error reacting or embedding: ${error}`))
   }
}
