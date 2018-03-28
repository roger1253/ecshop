var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 *  获取商品分类列表
 * @return {Promise}       包含抓取任务的Promise
 */

function getProductList (params) {
    return fetch(CONFIG.API_HOST,'/v2/ecapi.product.list', params);
}

function getProduct (params) {
    return fetch(CONFIG.API_HOST,'/v2/ecapi.product.get', params);
}

function purchase (params) {
    return fetch(CONFIG.API_HOST,'/v2/ecapi.product.purchase', params);
}

module.exports = { getProductList,
					getProduct,
					purchase };
