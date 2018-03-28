var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

// 取消订单
function cancelOrder (params) {
    return fetch(CONFIG.API_HOST, 'v2/ecapi.order.cancel', params);
}

// 确认收货
function confirmOrder (params) {
    return fetch(CONFIG.API_HOST, 'v2/ecapi.order.confirm', params);
}

// 计算价格
function price (params) {
    return fetch(CONFIG.API_HOST, 'v2/ecapi.order.price', params);
}

// 获取订单详情
function getOrderInfo (params) {
    return fetch(CONFIG.API_HOST, 'v2/ecapi.order.get', params);
}

module.exports = { cancelOrder,
                   confirmOrder,
                   price,
                   getOrderInfo };
