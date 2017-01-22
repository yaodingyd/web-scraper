var osmosis = require('osmosis');
var fs = require('fs');

let stream = fs.createWriteStream('result.txt');

osmosis
.get('https://www.revolico.com')
.find('.module li a:first')
.set('category')
.follow('@href')
.paginate('a.pagenav[title="Siguiente"]')
.find('.adsterix_set tr td > a:not([href^="javascript"])')
.set('entry')
.follow('@href')
.set({
    'title':        'h1.headingText',
    'description':  '.showAdText',
    'images':       ['.photo-frame img@src'],
    'email':        '#contact .normalText > a@href',
    'telephone':    '#contact .normalText:first@html'
})
.data(function(listing) {
    stream.write(listing.title);
    stream.write(listing.images.join('\n'));
    stream.write(listing.description);
    if (listing.email) {
      console.log(listing.email);
    }
})
.log(console.log)
//.error(console.log)
//.debug(console.log)