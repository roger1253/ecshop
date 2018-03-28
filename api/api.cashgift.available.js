var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 获取红包列表
 * @return {Promise}       包含抓取任务的Promise
 */

function getCashgiftAvailable (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cashgift.available', params);
}

module.exports = { getCashgiftAvailable };