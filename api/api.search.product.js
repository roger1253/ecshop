var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 获取搜索商品列表
 * @return {Promise}       包含抓取任务的Promise
 */

function getSearchProductList (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.search.product.list', params);
}

module.exports = { getSearchProductList };
