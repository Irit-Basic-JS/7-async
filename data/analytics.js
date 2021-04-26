const ANALYTICS = require('./analytics.json');

function getAnalytics (query) {
    const ogrns = (query.ogrn && query.ogrn.split(',')) || [];


    return ogrns.map(ogrn => ANALYTICS[ogrn]);
}

module.exports = getAnalytics;