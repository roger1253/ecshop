var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 *  获取商品分类列表
 * @return {Promise}       包含抓取任务的Promise
 */

function getCategoryList (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.category.list', params);
}

module.exports = { getCategoryList };
