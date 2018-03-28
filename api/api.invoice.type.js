var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 微信登陆
 * @return {Promise}       包含抓取任务的Promise
 */

function getInvoiceTypeList (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.invoice.type.list', params);
}

module.exports = { getInvoiceTypeList };
