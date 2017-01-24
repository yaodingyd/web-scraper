var osmosis = require('osmosis');
var util = require('./util');
var moment = require('moment');
var encoding = require('encoding');

moment.locale('es');

osmosis
.get('https://www.revolico.com')
.find('.module li a:first')
.set('category')
.follow('@href')
.paginate('a.pagenav[title="Siguiente"]', 1)
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
    if (listing.email) {
      listing.email = util.email(listing.email);
    } else {
      listing.email = '';
    }
    listing.category = util.getCategory(listing.category);
    listing.title = encoding.convert(listing.title, 'ISO-8859-1', 'UTF-8').toString();
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
    console.log('Title  : ' + listing.title);
    console.log('Email  : ' + listing.email);
    console.log('Phone  : ' + listing.telephone);
    console.log('Name   : ' + listing.name);
    console.log('Date   : ' + listing.date);
    console.log('URL    : ' + listing.url);
    console.log('Price  : ' + listing.price);
    console.log('Image  : ' + listing.images);
    console.log('Category: ' + listing.category);
    console.log('*************************************************************************************');
    
})
.done(function(){
  console.log('DONE!');
})
//.log(console.log)
//.error(console.log)
//.debug(console.log)