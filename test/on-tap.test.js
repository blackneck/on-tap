const assert = require('chai').assert;

const bars = require('../data/bars');
const onTap = require('../index');

describe('Get Bars', ()=> {
    it('should return an object of bars', ()=> {
        assert.instanceOf(onTap.getBars(), Object, 'bars is an object instance');
    });
});
