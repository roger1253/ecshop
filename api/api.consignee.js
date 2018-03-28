var CONFIG = require('../config/config.js');

const fetch = require('./fetch');

/**
 * 获取列表类型的数据
 * @return {Promise}       包含抓取任务的Promise
 */

// 获取收件人列表
function getConsigneeList (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.consignee.list', params);
}

// 删除收件人
function removeConsignee (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.consignee.delete', params);
}

// 修改收件人
function updateConsignee (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.consignee.update', params);
}

// 添加收件人
function addConsignee (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.consignee.add', params);
}

// 设置默认收件人
function defaultConsignee (params) {
    return fetch(CONFIG.API_HOST,'v2/ecapi.consignee.setDefault', params);
}

module.exports = { getConsigneeList,
                    removeConsignee,
                    updateConsignee,
                    addConsignee,
                    defaultConsignee };
