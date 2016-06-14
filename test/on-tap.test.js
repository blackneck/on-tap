const assert = require('chai').assert;
const needle = require('needle');
const sinon = require('sinon');

const bars = require('../data/bars');
const onTap = require('../index');
let mockResponse = {};
let sandbox;

describe('Get Bars', ()=> {
    it('should return an object of bars', ()=> {
        assert.instanceOf(onTap.getBars(), Object, 'bars is an object instance');
    });
});

describe('At Location', () => {
    beforeEach(function () {
        mockResponse.statusCode = 200;
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should return invalid bar error if requested bar is not found', () => {
        onTap.atLocation('invalid name', (err, beers) => {
            assert.equal(err, 'Invalid bar', 'correct error returned');
        });
    });

    it('should return invalid bar error if no bar name is passed', () => {
        onTap.atLocation(null, (err, beers) => {
            assert.equal(err, 'Invalid bar', 'correct error returned');
        });
    });

    it('should return needle error if one present', () => {
        sandbox.stub(needle, 'get').yields('needle error', null);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'needle error', 'correct error returned');
        });
    });

    it('should return site unavailable error if site not found', () => {
        mockResponse.statusCode = 404;
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'Site unavailable', 'correct error returned');
        });
    });

    it('should return details not found error if no tap details exist', () => {
        mockResponse.body = '<div class="wrong-class" ></div>';
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'on-tap details not found', 'correct error returned');
        });
    });

    it('should return expected uk bar url', () => {
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(needle.get.firstCall.args[0], 'https://www.brewdog.com/bars/uk/aberdeen');
        });
    });

    it('should return expected worldwide bar url', () => {
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('brussels', (err, beers) => {
            assert.equal(needle.get.firstCall.args[0], 'https://www.brewdog.com/bars/worldwide/brussels');
        });
    });

    it('should return expected list of beers on tap', () => {
        mockResponse.body = '<div class="barText">BREWDOG DRAFT<br>Dead Pony Club 3,8%<br>Vagabond Pale Ale 4,5%<br>--- Extra Beers ---<br>Ace of Chinook 4,5%<br>BEST OF BRITISH TAP TAKEOVER<br>Jet Black Heart 4,7%<br>CIDER DRAFT<br>5 AM Saint 5%<br>Punk IPA 5,6%<br>~~Convidadas~~<br>Hardcore IPA 9,2%<br><br>GUEST DRAFT<br>    <br>Erdinger - Urweisse 4,9%<br>Iso-Kallan Panimo - Biere de Garde 7%<br>CR/AK &amp; AF Brew - Fruit Sour IPA 7,5%<br> <br>HOPINATOR<br></div>';
        sandbox.stub(needle, 'get').yields(null, mockResponse);
        const expectedBeers = [
            'Dead Pony Club 3,8%',
            'Vagabond Pale Ale 4,5%',
            'Ace of Chinook 4,5%',
            'Jet Black Heart 4,7%',
            '5 AM Saint 5%',
            'Punk IPA 5,6%',
            'Hardcore IPA 9,2%',
            'Erdinger - Urweisse 4,9%',
            'Iso-Kallan Panimo - Biere de Garde 7%',
            'CR/AK &amp; AF Brew - Fruit Sour IPA 7,5%'
        ];

        onTap.atLocation('aberdeen', (err, actualBeers) => {
            assert.deepEqual(actualBeers, expectedBeers, 'beer results are as expected');
        });
    });
});
