var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 微信登陆
 * @return {Promise}       包含抓取任务的Promise
 */

function getInvoiceContentList (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.invoice.content.list', params);
}

function getInvoiceStstua(params) {
  return fetch(CONFIG.API_HOST, 'v2/ecapi.invoice.status.get', params);
}


module.exports = { getInvoiceContentList,
                   getInvoiceStstua };
