var CONFIG = require('../config/config.js');

const fetch = require('./fetch');


/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

function getProductList (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.home.product.list', params);
}

module.exports = { getProductList };
