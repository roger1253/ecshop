var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

function _add (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cart.add', params);
}

function _get (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cart.get', params);
}

function _delete (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cart.delete', params);
}

function _clear (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cart.clear', params);
}

function _update (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cart.update', params);
}

function checkout (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.cart.checkout', params);
}
module.exports = { 	_add,
					_get,
					_delete,
					_update,
					checkout,
                    _clear };
