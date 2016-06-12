const onTap = require('on-tap');

onTap.getBars();

onTap.atLocation('aberdeen', (err, beers) => {
    console.log(beers);
});
