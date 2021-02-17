/***************************************
* !gif searchterm
* Grab and post from the Tenor API
****************************************/
require('dotenv').config();
const fetch = require('node-fetch');

module.exports = {
   name: 'gif',
   description: 'Post a gif from Tenor',
   usage: '!gif searchterm',
   execute(message, args) {
      let gifURL = '';
      if (!args.length) {
         return message.reply(`You didn't provide any arguments. Usage: '!gif searchterm'`);
      } else if (args.length == 1) {
         gifURL = `https://api.tenor.com/v1/search?q=${args[0]}&key=${process.env.TENORKEY}&limit=8`;
      } else if (args.length > 1) {
         let searchTerm = ''
         for (let i=0; i<args.length; i++){
            searchTerm += args[i];
         }
         gifURL = `https://api.tenor.com/v1/search?q=${searchTerm}&key=${process.env.TENORKEY}&limit=8`;
      }
      (async function(){
         const response = await fetch(gifURL);
         const json = await response.json();
         message.channel.send(json.results[0].url);
      })();
   }
}
