var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 修改用户资料
 * @return {Promise}       包含抓取任务的Promise
 */

function profileUpdate (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.user.profile.update', params);
}

module.exports = { profileUpdate };
