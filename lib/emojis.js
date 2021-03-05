/***************************************
* Preload emojis                       *
****************************************/
const emojis = {
   kelso: '',
   avgnfuckyou: '',
   gunright: '',
   smerpderp: '',
   execute(clientEmojis){
      emojis.kelso = clientEmojis.cache.find(emoji => emoji.name === 'kelso');
      emojis.avgnfuckyou = clientEmojis.cache.find(emoji => emoji.name === 'AvgnFuckYou');
      emojis.gunright = clientEmojis.cache.find(emoji => emoji.name === 'GunRight');
      emojis.smerpderp = clientEmojis.cache.find(emoji => emoji.name === 'smerpderp');
   }
}
module.exports = { 
   emojis
};
