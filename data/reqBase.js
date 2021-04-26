const REQ_BASE = require('./reqBase.json');

function getReqBase (query) {
    const ogrns = (query.ogrn && query.ogrn.split(',')) || [];


    return ogrns.map(ogrn => REQ_BASE[ogrn]);
}

module.exports = getReqBase;