var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 注册字段
 * @return {Promise}       包含抓取任务的Promise
 */

function fields (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.user.profile.fields', params);
}

/**
 * 获取用户资料
 * @return {Promise}       包含抓取任务的Promise
 */

function _get (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.user.profile.get', params);
}

/**
 * 修改用户资料
 * @return {Promise}       包含抓取任务的Promise
 */

 function _update (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.user.profile.update', params);
}

/**
 * 修改用户密码
 * @return {Promise}       包含抓取任务的Promise
 */

 function passwordUpdate (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.user.password.update', params);
}

module.exports = { fields,
					_get,
					_update,
					passwordUpdate
 				};















