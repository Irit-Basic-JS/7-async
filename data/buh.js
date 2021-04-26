const BUH = require('./buh.json');

function getBuh (query) {
    const ogrns = (query.ogrn && query.ogrn.split(',')) || [];


    return ogrns.map(ogrn => BUH[ogrn]);
}

module.exports = getBuh;