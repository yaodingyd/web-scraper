var osmosis = require('osmosis');
var email = require('./util').email;
var fs = require('fs');
var moment = require('moment');
var encoding = require('encoding');
let stream = fs.createWriteStream('result.txt');

moment.locale('es');

osmosis
.get('https://www.revolico.com/computadoras/pc-de-escritorio/torres-de-6ta-generacion-desde-360-torres-4-ta-generacion-desde--17709411.html')
.header('Content-Type', 'text/html; charset=utf-8')
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
        data['price'] = parseInt(content.trim());
      }
      if (/^Fecha/.test(title)) {
        data['date'] = content;
      }
  }
})
.data(function(listing) {
    if (listing.email) {
      listing.email = email(listing.email);
    } else {
      listing.email = '';
    }
    listing.title = encoding.convert(listing.title, 'ISO-8859-1', 'UTF-8').toString();
    listing.images = '';
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
      if (phone.length > 0) {
        listing.telephone = phone[0];
      } else {
        listing.telephone = '';
      }
      listing.telephone = listing.telephone.replace(/\D+/g, '');
    }
    let values = [];
    console.log('Title  : ' + listing.title);
    console.log('Email  : ' + listing.email);
    console.log('Phone  : ' + listing.telephone);
    console.log('Name   : ' + listing.name);
    console.log('Date   : ' + listing.date);
    console.log('URL    : ' + listing.url);
    console.log('Price  : ' + listing.price);
    console.log('Image  : ' + listing.images);
    console.log('*************************************************************************************');
    
})
.done(function(){
  console.log('DONE!');
})
//.log(console.log)
//.error(console.log)
//.debug(console.log)

/*var i = 7;

osmosis
.get('https://www.revolico.com')
.find('.module li a')
.set('category')
.data(function(listing) {
    stream.write('"' + listing.category + '": ' + i++ + ',\n');
})
.done(function(){
  console.log('DONE!');
})
.log(console.log)*/