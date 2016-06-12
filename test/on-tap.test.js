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
            assert.equal(err, 'Invalid bar');
        });
    });

    it('should return site unavailable error if site not found', () => {
        mockResponse.statusCode = 404;
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'Site unavailable');
        });
    });

    it('should return details not found error if no tap details exist', () => {
        mockResponse.statusCode = 200;
        mockResponse.body = '<div class="wrong-class" ></div>';
        sandbox.stub(needle, 'get').yields(null, mockResponse);

        onTap.atLocation('aberdeen', (err, beers) => {
            assert.equal(err, 'on-tap details not found');
        });
    });
});
