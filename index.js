'use strict'

const rq = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs');
let $;
let stream = fs.createWriteStream('result.txt');

const BASE_URL = 'https://www.revolico.com';
const LIMIT = 10;
const options = {
    uri: BASE_URL,
    transform: function (body) {
        return cheerio.load(body);
    }
}

rq(options)
    .then(function($) {
        let search = $('li a');
        let category = _.flatMap(search, function(item){
            return item.attribs.href;
        })
        return category;
    })
    .then(function(category) {
        for (let i = 0; i < LIMIT; i++) {
            rq({
                uri: BASE_URL + category[i],
                transform: function (body) {
                    return cheerio.load(body);
                }
            })
            .then(function($) {
                let search = $('tr td a');
                let items = _.filter(search, function(item){
                    if (item.attribs.href !== 'javascript:')
                    return item.attribs.href;
                }).map(function(item){
                    return item.attribs.href;
                })
                return items;
            })
            .then(function(items)  {
                for (let j = 0; j < LIMIT; j++){
                    rq({
                        uri: BASE_URL + items[j],
                        transform: function (body) {
                            return cheerio.load(body);
                        }
                    })
                    .then(function($){
                        let description = $('.showAdText').html();
                        let photos = _.map($('.photo-frame img'), function(item){
                            return item.attribs['data-cfsrc'];
                        }).filter(function(item) {
                            return item !== undefined;
                        });
                        let contactHeaders = $('#contact .headingText2');
                        let contactContents = $('#contact .normalText');

                        let contacts = _.map(contactHeaders, function(node, index) {
                            if (contactContents.eq(index).find('a').length > 0)
                            return contactHeaders.eq(index).html() + contactContents.eq(index).find('a').attr('href');
                            else
                            return contactHeaders.eq(index).html() + contactContents.eq(index).text();
                        })
                        console.log('==============Description===========\n' + description);
                        console.log('================Photo==============\n' + photos.join('\n'));
                        console.log('===============Contacts============\n' + contacts.join('\n'));
                        // do something else here, maybe store in db    
                        stream.write(description);
                        stream.write(photos.join('\n'));
                        stream.write(contacts.join('\n'));
                            
                    })
                }
            })
        }
    })
    .catch(function(e){
        console.log(e);
    })

