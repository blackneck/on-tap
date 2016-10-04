const excluded = require('../data/excluded');
const bars = require('../data/bars');
const cheerio = require('cheerio');
const entities = require('entities');
const inArray = require('in-array');
const needle = require('needle');
const NodeCache = require('node-cache');
const cacheLife = '86400';

const localCache = new NodeCache({ stdTTL: cacheLife });

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

        if(new RegExp(excluded.join('|')).test(beers[i])) {
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

    const cached = localCache.get(barName);
    if(cached) return callback(null, cached);

    needle.get(brewdogUrl, function(err, response){
        if(err) return callback(err);
        if(response.statusCode !== 200) return callback('Site unavailable');
        
        const beerHTML = cheerio.load(response.body)('.barText').html();
        if(beerHTML === null) return callback('on-tap details not found');

        const beers = filterTapResults(entities.decodeHTML(beerHTML));

        localCache.set(barName, beers);
        return callback(null, beers);
     });
};

module.exports = exports;
