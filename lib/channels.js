/***************************************
* Preload channels                     *
****************************************/
const logger = require('../logger');

const channels = {
   channel7d2d: '',
   channelNormalChat: '',
   channelMemes: '',
   testChat: '',
   chattyMcChatFace: '',
   execute(clientChannels){
      const map = {
         channelNormalChat: process.env.CHANNEL_NORMALCHAT,
         channel7d2d: process.env.CHANNEL_7D2D,
         channelMemes: process.env.CHANNEL_MEMES,
         testChat: process.env.CHANNEL_TEST,
         chattyMcChatFace: process.env.CHANNEL_CHATTYMCCHATFACE,
      };
      for (const name of Object.keys(map)) {
         const id = map[name];
         channels[name] = id ? clientChannels.cache.get(id) : undefined;
         if (!channels[name]) {
            logger.warn(`channels.${name}: env id="${id || ''}" did not resolve to a cached channel`);
         }
      }
   }
}
module.exports = {
   channels
};
