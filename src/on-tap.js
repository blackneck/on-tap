const Entities = require('html-entities').AllHtmlEntities;
const excluded = require('../data/excluded');
const bars = require('../data/bars');
const cheerio = require('cheerio');
const inArray = require('in-array');
const needle = require('needle');
const entities = new Entities();

let exports = {};

function buildBrewdogUrl(barName) {
    const baseUrl = 'https://www.brewdog.com/bars';

    if(!barName) return false;

    barName = barName.toLowerCase();

    if(inArray(bars.uk, barName)) {
        return `${baseUrl}/uk/${barName}`;

    } else if(inArray(bars.worldwide, barName)) {
        return `${baseUrl}/worldwide/${barName}`;

    } else {
        return false;
    }
}

function filterTapResults(beerHTML) {
    let beers = beerHTML.split('<br>');
    beers = beers.filter(i => i.trim() !== '');

    for(let i = 0; i < beers.length; i++) {
        beers[i] = beers[i].trim();

        if(inArray(excluded.headings, beers[i]) ||
            new RegExp(excluded.sections.join('|')).test(beers[i]))
        {
            beers.splice(i, 1);
        }
    }

    return beers;
}

exports.getBars = () => {
    return bars;
};

exports.atLocation = (barName, callback) => {
    const brewdogUrl = buildBrewdogUrl(barName);
    if(!brewdogUrl) return callback('Invalid bar');

    needle.get(brewdogUrl, function(err, response){
        if(err) return callback(err);
        if(response.statusCode !== 200) return callback('Site unavailable');

        const beerHTML = cheerio.load(response.body)('.barText').html();
        if(beerHTML === null) return callback('on-tap details not found');

        const beers = filterTapResults(entities.decode(beerHTML));

        return callback(null, beers);
     });
};

module.exports = exports;
