/***************************************
* Dependencies
****************************************/
const fetch = require('node-fetch');
const logger = require('../logger');

const nextURL = 'https://date.nager.at/api/v3/nextpublicholidays/us';
const timestamp = new Date();
const today = `${timestamp.getFullYear()}-${`0${timestamp.getMonth()+1}`.slice(-2)}-${`0${timestamp.getDate()}`.slice(-2)}`;
logger.info(`Today's date is: ${today}`);

/***************************************
* Do the fetchin'
****************************************/
const todayHoliday = callback => {
   fetch(nextURL)
   .then(response => response.json())
   .then(json => {
      logger.info("Is today a public holiday?");
      const next = json && json[0];
      if (next && next.date === today) {
         callback(next.localName);
      }
   })
   .catch(error => logger.error(`Error receiving holiday API data: ${error}`));
}

const fetchHoliday = callback => {
   fetch(nextURL)
   .then(response => response.json())
   .then(json => {
      logger.info("When is the next public holiday?");
      const nextHoliday = json[0];
      const dateHoliday = nextHoliday.date.split("-");
      callback(`${nextHoliday.localName} is the next holiday on ${`${dateHoliday[1]}/${dateHoliday[2]}/${dateHoliday[0].substring(2)}`}`);
   })
   .catch(error => logger.error(`Error receiving holiday API data: ${error}`))
};

module.exports = { 
   todayHoliday, 
   fetchHoliday
};
