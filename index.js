var scrape = require('./scrape');

/** 
 * @index           the index of sub-category to begin scraping
 * @filterEnable    default is false. Set true to add filting when insert entry to db.
 * @delay           throttle request. Default is 300(ms).
*/
scrape(0, false);