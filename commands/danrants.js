/*************************************************************************
* !rants
* Post how many Dan rants there are
* TODO: Store these rants and make an embed to scroll through them
**************************************************************************/
require('dotenv').config();
module.exports = {
   name: 'rants',
   description: 'Post how many Dan rants there are',
   usage: '!rants',
   async execute(message) {
      let messages = [];
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
      let count = 0;
      for (const rant of messages) {
         console.log(rant.content);
         count++;
      }
      message.channel.send(`Dan's rant count = ${count}`);
   }
}
