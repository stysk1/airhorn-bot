/***************************************
* Preload channels                     *
****************************************/
const channels = {
   channel7d2d: '',
   channelNormalChat: '',
   channelMemes: '',
   testChat: '',
   execute(clientChannels){
      const map = {
         channelNormalChat: process.env.CHANNEL_NORMALCHAT,
         channel7d2d: process.env.CHANNEL_7D2D,
         channelMemes: process.env.CHANNEL_MEMES,
         testChat: process.env.CHANNEL_TEST,
      };
      for (const name of Object.keys(map)) {
         const id = map[name];
         channels[name] = id ? clientChannels.cache.get(id) : undefined;
         if (!channels[name]) {
            console.warn(`channels.${name}: env id="${id || ''}" did not resolve to a cached channel`);
         }
      }
   }
}
module.exports = { 
   channels
};