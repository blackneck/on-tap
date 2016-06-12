const onTap = require('on-tap');

onTap.getBars();

onTap.atLocation('aberdeen', (err, beers) => {
    if(err) console.log(err);

    console.log(beers);
});
