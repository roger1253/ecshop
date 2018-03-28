var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 微信登陆
 * @return {Promise}       包含抓取任务的Promise
 */

function authSocial (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.auth.social', params);
}

module.exports = { authSocial };
