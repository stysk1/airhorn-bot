/***************************************
* Dependencies
****************************************/
const fetch = require('node-fetch');

const todayURL = 'https://date.nager.at/api/v2/istodaypublicholiday/us';
const nextURL = 'https://date.nager.at/api/v2/nextpublicholidays/us';
const timestamp = new Date();
const today = `${timestamp.getFullYear()}-${`0${timestamp.getMonth()+1}`.slice(-2)}-${`0${timestamp.getDate()}`.slice(-2)}`;
console.log(`Today's date is: ${today}`);

/***************************************
* Do the fetchin'
****************************************/
const todayHoliday = () => {
   try {
      const response = await fetch(todayURL);
      if (response.status === 204) {
         callback(null);
      } else {
         const json = await response.json();
         console.log("Is today a public holiday?");
         const nextHoliday = json[0];
         if (nextHoliday.date === today) {
            return (callback) => {
               callback(nextHoliday.localName);
            }
         }
      }
   } catch (error) {
      console.error(`Error receiving holiday API data: ${error}`);
   }
}

const fetchHoliday = (callback) => {
   try {
     const response = await fetch(nextURL);
     const json = await response.json();
     console.log("When is the next public holiday?");
     const nextHoliday = json[0];
     const dateHoliday = nextHoliday.date.split("-");
     callback(`${nextHoliday.localName} is the next holiday on ${dateHoliday[1]}/${dateHoliday[2]}/${dateHoliday[0].substring(2)}`);
   } catch (error) {
     console.error(`Error receiving holiday API data: ${error}`);
   }
};

module.exports = { 
   todayHoliday, 
   fetchHoliday
};
