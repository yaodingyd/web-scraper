var scrape = require('./scrape');

let nodup = false;
let index = 0;

process.argv.forEach(function (val, index, array) {
  if (val === 'nodup') {
    nodup = true;
  }
  if (val === 'allcat') {
    index = 0;
  }
});

/** 
 * @index           the index of sub-category to begin scraping
 * @filterEnable    default is false. Set true to add filting when insert entry to db.
 * @delay           throttle request. Default is 300(ms).
*/
scrape(index, nodup);