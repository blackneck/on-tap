# Brewdog On Tap
[![npm version](https://badge.fury.io/js/on-tap.svg)](https://www.npmjs.com/package/on-tap)
[![Build Status](https://travis-ci.org/clementallen/on-tap.svg?branch=master)](https://travis-ci.org/clementallen/on-tap)
[![Code Climate](https://codeclimate.com/github/clementallen/on-tap/badges/gpa.svg)](https://codeclimate.com/github/clementallen/on-tap)
[![Coverage Status](https://coveralls.io/repos/github/clementallen/on-tap/badge.svg?branch=master)](https://coveralls.io/github/clementallen/on-tap?branch=master)
[![Dependency Status](https://david-dm.org/clementallen/on-tap.svg)](https://david-dm.org/clementallen/on-tap)
[![devDependency Status](https://david-dm.org/clementallen/on-tap/dev-status.svg)](https://david-dm.org/clementallen/on-tap#info=devDependencies)

[![NPM](https://nodei.co/npm/on-tap.png?downloads=true&stars=true)](https://nodei.co/npm/on-tap/)

### Install
```
npm install --save on-tap
```

### Example
``` javascript
const onTap = require('on-tap');

const bars = onTap.getBars();
console.log(bars); // => { uk: ['bar1', 'bar2'] }

onTap.atLocation('aberdeen', (err, beers) => {
    if(err) console.log(err);

    console.log(beers); // => ['beer1', 'beer2']
});
```

### Run tests
```
npm run test
```

## License
ISC © [Clement Allen](http://clementallen.com)
