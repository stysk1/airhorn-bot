/***********************************************************
* !nextholiday
* Retrieve the next holiday and have the bot post about it
************************************************************/
const { fetchHoliday } = require('../scripts/holidays.js');
const logger = require('../logger');
module.exports = {
   name: 'nextholiday',
   description: 'Retrieve the next holiday and have the bot post about it',
   usage: '!nextholiday',
   execute(message, args, emojis) {
      const whenHoliday = data => {
         logger.info(data);
         message.channel.send(data);
      };
      fetchHoliday(whenHoliday);
   }
}
