/***************************************
* !movie searchterm
* Grab from the OMDB API to get movie info
****************************************/
require('dotenv').config();
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
   name: 'movie',
   description: 'Retrieve a movie based on your search parameters and embed it via the bot',
   usage: '!movie searchterm',
   execute(message, args) {
      let searchOptions = '';
      const omdb_url = `http://omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&`;
      if (!args.length) {
         return message.reply(`You didn't provide any arguments. Usage: '!movie searchterm'`);
      } else if (args.length > 0) {
         let searchTerm = '';
         for (let i=0; i<args.length; i++){
            searchTerm += args[i];
            if (i < args.length-1) searchTerm += ' ';
         }
         searchOptions = `${omdb_url}s=${searchTerm}&type=movie&r=json`;
      }
      (async function(){
         let response = await fetch(searchOptions);
         let json = await response.json();

         if (json.Response === 'True') {
            console.log(json.Search[0]);
            try {
               const foundMovie = `${omdb_url}i=${json.Search[0].imdbID}&plot=short&r=json&tomatoes=true`;
               response = await fetch(foundMovie);
               json = await response.json();
               console.log(json)

               let url = '';
               let poster = '';
               if (json.tomatoURL != 'N/A') url = json.tomatoURL;
               if (json.Poster != 'N/A') poster = json.Poster;

               let movieEmbed = new Discord.MessageEmbed()
                  .setColor('#ebc40f')
                  .setTitle(json.Title)
                  .setURL(url)
                  .addField('Released', json.Released, true)
                  .addField('Runtime', json.Runtime, true)
                  .addField('Genre', json.Genre, true)
                  .setImage(poster)
                  .setDescription(json.Plot)
                  .setFooter('Provided to you by the OMDB API and Cockmeat2000');
               message.channel.send(movieEmbed);
            } catch (e) {
               console.error(e);
            }
         } else {
            console.log(json);
            message.channel.send("Movie not found or bad search parameters");
         }
      })();
   }
}
