function scrape(index, filterEnable, delay) {
  var osmosis = require('osmosis');
  var fs = require('fs');
  var util = require('./util');
  var moment = require('moment');
  var encoding = require('encoding');
  var subCategory = require('./util').subCategory;
  delay = delay || 300;
  filterEnable = filterEnable || false;

  let stream = fs.createWriteStream('result.txt');
  moment.locale('es');

  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'scraper'
  });

  connection.connect();

  index = index || 0;
  traverse(index);

  function traverse(index){
    let instance = osmosis
    .get('https://www.revolico.com' + subCategory[index])
    .paginate('a.pagenav[title="Siguiente"]')
    .find('.adsterix_set tr td > a:not([href^="javascript"])')
    .set({
        'url':          '@href'         
    })
    .delay(delay)
    .follow('@href')
    .config('timeout', 1000)
    .set({
        'title':        'h1.headingText',
        'description':  '.showAdText',
        'images':       ['.photo-frame img@src'],
        'email':        '#contact .normalText > a .__cf_email__@data-cfemail'
    })
    .then(function(context, data){
      let contacts = context.find('#lineBlock');
      for (let i = 0; i < contacts.length; i++) {
          let title = contacts[i].find('.headingText2')[0].innerHTML;
          let content =  contacts[i].find('.normalText')[0].innerHTML;
          if (/^Nombre/.test(title)) {
            data['name'] = content;
          }
          if (/^Tel/.test(title)) {
            data['telephone'] = content;
          }
          if (/^Precio/.test(title)) {
            data['price'] =  parseInt(content.trim());
          }
          if (/^Fecha/.test(title)) {
            data['date'] = content;
          }
      }
    })
    .data(function(listing) {
      if (!filterEnable) {
        insertToDB(listing);
      } else {
        let checkDup = 'SELECT id FROM posts WHERE urls = ?'
        connection.query(checkDup, [listing.url], function(error, results, fields){
          if (results.length === 0) {
            insertToDB(listing);
          }
        })   
      }
    })
    .done(function(){
      console.log('Finish subCategory ' + index);
      stream.write('Finish subCategory ' + index + '\n');
      if (index + 1 < 67) {
        process.nextTick(function(){
          traverse(index + 1);
        })
      } else {
        console.log('DONE!');
      }

    })
    //.log(console.log)
    .error(console.log)
    .debug(console.log)
  }

  function insertToDB(listing) {
    if (listing.email) {
      listing.email = util.email(listing.email);
    } else {
      listing.email = '';
    }
    listing.category = index;//util.getCategory(listing.category);
    listing.title = encoding.convert(listing.title, 'ISO-8859-1', 'UTF-8').toString();
    listing.description = encoding.convert(listing.description, 'ISO-8859-1', 'UTF-8').toString();
    listing.images = listing.images.join('\n');
    if (listing.date) {
      listing.date = moment(listing.date, 'LLLL').format('YYYY-MM-DD hh:mm:ss');
    }
    if (!listing.price) {
      listing.price = '';
    }
    if (!listing.name) {
      listing.name = '';
    }
    if (!listing.telephone) {
      let phone = listing.title.match(/[\d]{2}-[\d]{2}-[\d]{2}-[\d]{2}|[\d]{8}|[\d]{1,3}[\s]?[\d]{1,3}[\s]?[\d]{1,3}[\s][\d]{1,3}/);
      if (phone && phone.length > 0) {
        listing.telephone = phone[0];
      } else {
        listing.telephone = '';
      }
      listing.telephone = listing.telephone.replace(/\D+/g, '');
    }
    let values = [];
    values.push(listing.title);
    values.push(listing.email);
    values.push(listing.telephone);
    values.push(listing.name);
    values.push(listing.date);
    values.push(listing.url);
    values.push(listing.price);
    values.push(listing.images);
    values.push(listing.category);
    values.push(listing.description);
    let SQL = 'INSERT INTO posts (title, emails, phones, contactname, postdate, urls, price, images, category, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    connection.query(SQL, values, function (error, results, fields) {
      if (error) throw error;
    });
  }

}

module.exports = scrape;