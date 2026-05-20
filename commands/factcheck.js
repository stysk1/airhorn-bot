/***************************************
* !factcheck searchterm
* Grab and post from the Fact Matcher API
****************************************/
require('dotenv').config();
const logger = require('../logger');
const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
   name: 'factcheck',
   description: 'Post a fact-check result',
   usage: '!factcheck searchterm',
   execute(message, args) {
      if (!args.length) {
         return message.reply(`You didn't provide any arguments. Usage: '!factcheck searchterm'`);
      }

      let inputText = args.join(' '); // Combine all arguments to form the input text
      let apiUrl = `https://idir.uta.edu/claimbuster/api/v2/query/fact_matcher/${encodeURIComponent(inputText)}`;

      (async function() {
         try {
            const response = await fetch(apiUrl, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  'x-api-key': process.env.FACTCHECK_API_KEY, // API key from .env
               },
            });

            if (!response.ok) {
               throw new Error('API request failed');
            }

            const json = await response.json();
            logger.debug(`FACT CHECK DATA: ${json.justification}`);
            if (!json.justification || json.justification.length === 0) {
               return message.reply('Sorry, I couldn\'t find a valid fact check for that query.');
            }

            // Extract relevant information from the response
            const claim = json.claim;
            const truthRating = json.justification[0].truth_rating; // Get the truth rating
            const factCheckUrl = json.justification[0].url; // URL to the fact check
            const speaker = json.justification[0].speaker; // Speaker in the claim
            const searchClaim = json.justification[0].claim; // Original claim

            // Set the embed color based on the truth rating
            let embedColor = '#ebc40f'; // Default color (neutral gray)
            let likelihood = '';
            let imageFile = '';

            // Determine likelihood and embed color based on the truth rating
            switch (truthRating) {
               case 'True':
                  imageFile = './media/tom-true.gif';
                  embedColor = '#4CAF50'; // Green for true claims
                  likelihood = 'This claim is true.';
                  break;
               case 'Mostly True':
                  imageFile = './media/tom-mostlytrue.gif';
                  embedColor = '#8BC34A'; // Lighter green for mostly true claims
                  likelihood = 'This claim is mostly true.';
                  break;
               case 'Mostly False':
                  imageFile = './media/tom-mostlyfalse.gif';
                  embedColor = '#8BC34A'; // Lighter green for mostly true claims
                  likelihood = 'This claim is mostly false.';
                  break;
               case 'False':
                  imageFile = './media/tom-false.gif';
                  embedColor = '#F44336'; // Red for false claims
                  likelihood = 'This claim is false.';
                  break;
               case 'Not the Whole Story':
               case 'Misleading':
               case 'No Evidence':
                  embedColor = '#9E9E9E'; // Gray for neutral claims
                  likelihood = `This claim is considered: ${truthRating}.`;
                  break;
               default:
                  likelihood = 'The truth of this claim could not be determined.';
                  break;
            }

            const attachment = new Discord.MessageAttachment(imageFile);
            let factCheckEmbed = new Discord.MessageEmbed()
               .setColor(embedColor)
               .setTitle(`Claim: "${claim}"`)
               .attachFiles(attachment)  // Attach the image
               .setImage('attachment://' + imageFile.split('/').pop())
               .addField('Speaker', speaker, true)
               .addField('Claim Reviewed', `"${searchClaim}"`, true)
               .addField('Verdict', likelihood, true)
               .setDescription(`Full Fact Check: [Read More](${factCheckUrl})`)
               .setFooter('Provided to you by the ClaimBuster API and the Airhorn Bot');
            message.channel.send(factCheckEmbed);

         } catch (error) {
            console.error(`Error fetching fact check: ${error}`);
            message.reply('Something went wrong while fetching the fact-check.');
         }
      })();
   }
};
