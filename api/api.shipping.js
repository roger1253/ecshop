var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

function getShippingStatus (params) {
    return fetch(CONFIG.API_HOST, 'v2/ecapi.shipping.status.get', params);
}

function list (params) {
    return fetch(CONFIG.API_HOST, 'v2/ecapi.shipping.vendor.list', params);
}

module.exports = { getShippingStatus,
					list };
