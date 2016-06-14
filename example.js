const onTap = require('on-tap');

const bars = onTap.getBars();
console.log(bars);

onTap.atLocation('aberdeen', (err, beers) => {
    if(err) console.log(err);

    console.log(beers);
});
