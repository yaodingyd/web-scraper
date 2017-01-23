var osmosis = require('osmosis');
var fs = require('fs');
var email = require('./email');
var moment = require('moment');

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

//let stream = fs.createWriteStream('result.txt');

osmosis
.get('https://www.revolico.com')
.find('.module li a:first')
.set('category')
.follow('@href')
.paginate('a.pagenav[title="Siguiente"]')
.find('.adsterix_set tr td > a:not([href^="javascript"])')
.set({
    'url':          '@href'         
})
.follow('@href')
.set({
    'title':        'h1.headingText',
    'description':  '.showAdText',
    'images':       ['.photo-frame img@src'],
    'email':        '#contact .normalText > a .__cf_email__@data-cfemail'
})
.then(function(context, data){
  let contacts = context.find('#lineBlock');
  for (let i = 1; i < contacts.length; i++) {
      let title = contacts[i].find('.headingText2')[0].innerHTML;
      let content =  contacts[i].find('.normalText')[0].innerHTML;
      if (title === 'Nombre: ') {
        data['name'] = content;
      }
      if (/^Tel/.test(title)) {
        data['telephone'] = content;
      }
      if (/^Precio/.test(title)) {
        data['price'] = content.match(/^[\d]+$/);
      }
      if (/^Fec/.test(title)) {
        data['date'] = content;
      }
  }
})
.data(function(listing) {
    if (listing.email) {
      listing.email = email(listing.email);
    } else {
      listing.email = 'place@hold.it';
    }
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
      listing.telephone = '';
    }
    let values = [];
    /*listing.forEach(function(item){
      values.push(item);
    })*/
    values.push(listing.title);
    values.push(listing.email);
    values.push(listing.telephone);
    values.push(listing.name);
    values.push(listing.date);
    values.push(listing.url);
    values.push(listing.price);
    values.push(listing.images);
    let SQL = 'INSERT INTO posts (title, emails, phones, contactname, postdate, urls, price, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    connection.query(SQL, values, function (error, results, fields) {
      if (error) throw error;
    });
})
.done(function(){
  connection.end();
  console.log('DONE!');
})
//.log(console.log)
.error(console.log)
//.debug(console.log)