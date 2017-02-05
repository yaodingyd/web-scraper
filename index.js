var scrape = require('./scrape');

var nodup = false;
var index = 0;

process.argv.forEach(function (val, i, array) {
  if (val === 'nodup') {
    nodup = true;
  }
  if (val === 'allcat') {
    index = 0;
  }
  if (/\d/.test(val)) {
    index = parseInt(val);
  }
});

console.log('Scraping sub-category ' + index + ' nodup is ' + nodup);

/** 
 * @index           the index of sub-category to begin scraping
 * @filterEnable    default is false. Set true to add filting when insert entry to db.
 * @delay           throttle request. Default is 300(ms).
*/
scrape(index, nodup);