/***************************************
* Preload channels                     *
****************************************/
const channels = {
   channel7d2d: '',
   channelNormalChat: '',
   channelMemes: '',
   testChat: '',
   execute(clientChannels){
      channels.channelNormalChat = clientChannels.cache.get(process.env.CHANNEL_NORMALCHAT);
      channels.channel7d2d = clientChannels.cache.get(process.env.CHANNEL_7D2D);
      channels.channelMemes = clientChannels.cache.get(process.env.CHANNEL_MEMES);
      channels.testChat = clientChannels.cache.get(process.env.CHANNEL_TEST);
   }
}
module.exports = { 
   channels
};