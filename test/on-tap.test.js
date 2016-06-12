const assert = require('chai').assert;
const needle = require('needle');
const sinon = require('sinon');

const bars = require('../data/bars');
const onTap = require('../index');
let mockResponse = {};

describe('Get Bars', ()=> {
    it('should return an object of bars', ()=> {
        assert.instanceOf(onTap.getBars(), Object, 'bars is an object instance');
    });
});

describe('At Location', () => {
    let sandbox;
    beforeEach(function () {
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

    it('should return site unavailable error if site not found', () => {
        mockResponse.statusCode = 404;
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'Site unavailable', 'correct error returned');
        });
    });

    it('should return details not found error if no tap details exist', () => {
        mockResponse.statusCode = 200;
        mockResponse.body = '<div class="wrong-class" ></div>';
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'on-tap details not found', 'correct error returned');
        });
    });

    it('should return expected uk bar url', () => {
        mockResponse.statusCode = 200;
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(needle.get.firstCall.args[0], 'https://www.brewdog.com/bars/uk/aberdeen');
        });
    });

    it('should return expected worldwide bar url', () => {
        mockResponse.statusCode = 200;
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('brussels', (err, beers) => {
            assert.equal(needle.get.firstCall.args[0], 'https://www.brewdog.com/bars/worldwide/brussels');
        });
    });

    it('should return expected list of beers on tap', () => {
        mockResponse.statusCode = 200;
        mockResponse.body = '<div class="barText">BREWDOG HEADLINERS<br>Dead Pony Club 3.8%<br>Jet Black Heart 4.7%<br>Kingpin lager 4.7%<br>5AM Saint 5.0%<br>Punk IPA 5.4%<br>OTHER BREWDOG DRAFT<br>Vagabond Pale Ale (GF) 4.5%<br>Bourbon Baby 5.9%<br>--- Extra Beers ---<br>Elvis Juice 6.5%<br>DIPA 9.2%<br>AB:20 14.1%<br>GUEST DRAFT<br>Summer Love 5.2% Victory<br>Fruitlands 4.8% Modern Times<br>Monster\'s Park 12% Modern Times<br>Lomaland Saison 5.5% Modern Times<br>Gueuze 100% Lambic Bio 5% Cantillon<br>Framboise 2.5% Lindemans<br></div>';
        sandbox.stub(needle, 'get').yields(null, mockResponse);
        const expectedBeers = [
            'Dead Pony Club 3.8%',
            'Jet Black Heart 4.7%',
            'Kingpin lager 4.7%',
            '5AM Saint 5.0%',
            'Punk IPA 5.4%',
            'Vagabond Pale Ale (GF) 4.5%',
            'Bourbon Baby 5.9%',
            'Elvis Juice 6.5%',
            'AB:20 14.1%',
            'Summer Love 5.2% Victory',
            'Fruitlands 4.8% Modern Times',
            'Monster&apos;s Park 12% Modern Times',
            'Lomaland Saison 5.5% Modern Times',
            'Gueuze 100% Lambic Bio 5% Cantillon',
            'Framboise 2.5% Lindemans'
        ];

        onTap.atLocation('aberdeen', (err, actualBeers) => {
            assert.deepEqual(expectedBeers, actualBeers, 'beer results are as expected');
        });
    });
});
