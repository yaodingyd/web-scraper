var osmosis = require('osmosis');
var email = require('./email');
var moment = require('moment');

moment.locale('es');

osmosis
.get('https://www.revolico.com', 1)
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