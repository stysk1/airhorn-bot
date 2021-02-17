/***************************************
* Dependencies
****************************************/
const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

const fetchURL = 'https://7daystodie.com/news';

/***************************************
* Do the fetchin'
****************************************/
const updates7d2d = callback => {
   fetch(fetchURL)
   .then(response => response.text())
   .then(text => {
      console.log("Received data");
      const dom = new JSDOM(text).window.document;
      const newsTitle = dom.getElementsByTagName("article")[0].getElementsByTagName("A")[0].innerHTML.trim();
      const newsLink = dom.getElementsByTagName("article")[0].getElementsByTagName("A")[0].href;
      if (!(newsLink.match(/[iI]s [oO]ut/) || newsLink.match(/[sS]table/) || newsLink.match(/[pP]atch/))) throw "Not a new article";
      const newsDesc = dom.getElementsByTagName("article")[0].getElementsByClassName("entry-content")[0];
      let formattedDesc = '';

      let descPs = [];
      for (let i=0; i<newsDesc.children.length; i++){
         if (newsDesc.children[i].tagName != "P" && newsDesc.children[i].tagName != "H1" &&
            newsDesc.children[i].tagName != "H2" && newsDesc.children[i].tagName != "H3") break;
         descPs.push(newsDesc.children[i]);
      }
      for (let i=0; i<descPs.length; i++){
         if (descPs[i].nextElementSibling && descPs[i].nextElementSibling.tagName == "UL") {
            formattedDesc += `**${descPs[i].textContent}**\n`;
         } else {
            formattedDesc += `${descPs[i].textContent}\n\n`;
         }
         if (descPs[i].nextElementSibling && (descPs[i].nextElementSibling.tagName != "P" &&
            descPs[i].nextElementSibling.tagName != "H1" && descPs[i].nextElementSibling.tagName != "H2" &&
            descPs[i].nextElementSibling.tagName != "H3")) break;
      }

      const descULs = newsDesc.getElementsByTagName("UL");
      for (let i=0; i<descULs.length; i++){
         const descLIs = descULs[i].children;
         for (let j=0; j<descLIs.length; j++){
            formattedDesc += `- ${descLIs[j].textContent}\n`;
            if (descLIs[j].nextElementSibling && descLIs[j].nextElementSibling.tagName != "LI") break;
         }
         formattedDesc += '\n\n';
         if (!(descULs[i].nextElementSibling && descULs[i].nextElementSibling.tagName != "UL" && 
            descULs[i].nextElementSibling.tagName == "P" && descULs[i].nextElementSibling.nextElementSibling.tagName == "UL")) {
            break;
         } else {
            formattedDesc += `**${descULs[i].nextElementSibling.textContent}**\n`;
         }
      }
      callback({
         description: formattedDesc,
         link: newsLink,
         title: newsTitle
      });
   })
   .catch(error => console.error(`Error receiving website data: ${error}`))
}

module.exports = { updates7d2d };
