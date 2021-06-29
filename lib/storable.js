const Discord = require('discord.js');
module.exports = class Storable {
   constructor(data) {
      this._data = data;
   }
   get data() {
      return this._data;
   }
   toEmbed(page=0){
      const embed = new Discord.MessageEmbed()
         .setColor('#ebc40f')
         .setDescription(this._data[page])
         .setFooter(`${page + 1}/${this._data.length}`);
      return embed;
   }
   gifEmbed(page=0){
      const embed = new Discord.MessageEmbed()
         .setColor('#ebc40f')
         .setImage(this._data[page].media[0].gif.url)
         .setFooter(`${page + 1}/${this._data.length}`);
      return embed;
   }
   react(message, author){
      message.react('⬅️')
      .then(message.react('➡️'));
      const collector = message.createReactionCollector(
         (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
         {time: 600000}
      )
      let currentIndex = 0;
      collector.on('collect', reaction => {
         if (reaction.emoji.name === '⬅️' && currentIndex !== 0) {
            currentIndex -= 1;
            if(message.embeds[0].image) message.edit(this.gifEmbed(currentIndex));
            else message.edit(this.toEmbed(currentIndex));
         }
         else if (reaction.emoji.name === '➡️' && currentIndex !== this._data.length-1) {
            currentIndex += 1;
            if(message.embeds[0].image) message.edit(this.gifEmbed(currentIndex));
            else message.edit(this.toEmbed(currentIndex));
         }
         else {
            throw "Useless emoji reaction";
         }
      })
   }
}
