const XXTEA = require('../utils/xxtea.js');
const CryptoJS = require('../utils/sha256.js');
const _promise = require('../libs/promise/es6-promise.min.js');
var CONFIG = require('../config/config.js');


/**
 * 抓取远端API的结构
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Object} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */

module.exports = function (api, path, params) {
  return new _promise((resolve, reject) => {

  function appNetworkResponseResolve(response){
        //var headers = response.headers();
        //var ErrorCode = parseInt(headers['x-ecapi-errorcode']);
        //var ErrorDesc = headers['x-ecapi-errordesc'];
        //var NewAuthorization = headers['x-ecapi-new-authorization'];
        if(CONFIG.ENCRYPTED)
        {
            if (response.data && response.data.data) {
                var raw = XXTEA.decryptFromBase64(response.data.data, xxtea_key);
                var json = JSON.parse(raw);
                if (json) {
                    delete response.data.data;
                    //response.data.error_code = ErrorCode;
                    //response.data.error_desc = ErrorDesc;
                    for (var key in json) {
                       response.data[key] = json[key];
                    }
                     console.log('appNetworkResponseResolve :' + JSON.stringify(response));
                    resolve(response);
                }
            }
            else
            {
                var tips = {};
                tips.title = response.data.message;
                // wx.showToast({
                //     title: tips.title
                // });

                if(response.data.error_code == 10001){
                    wx.clearStorageSync();
                    getApp().globalData.userInfo = d.data.user;
                    getApp().globalData.token = d.data.token;                    
                    getApp().login();
                }
            }
        }
        else{
            if (response.data && response.data.error_code == 0) {                                
                    console.log('appNetworkResponseResolve :' + JSON.stringify(response));
                    resolve(response);                
            }
            else
            {
                var tips = {};
                tips.title = response.data.error_desc;
                wx.showToast({
                    title: tips.title
                });
                if(response.data.error_code == 10001){
                    getApp().login();
                }
            }            
        }
    }


    function appNetworkResponseReject(response){
        //var headers = response.headers();
        //var ErrorCode = parseInt(headers['x-ecapi-errorcode']);
        //var ErrorDesc = headers['x-ecapi-errordesc'];
        //var NewAuthorization = headers['x-ecapi-new-authorization'];
         console.log('aaaaaaaaaaaaaaaaaaaaaa');
        {
            if (response.data && response.data.data) {                        
                reject(response);                
            }
        }
    }

    var sign_key = "arc4random()";
    var xxtea_key = "getprogname()";

    var headers = {};
    headers['X-ECAPI-UserAgent'] = 'Platform/Wechat';
    headers['X-ECAPI-UDID']      = null;
    headers['X-ECAPI-Ver']       = "1.1.0";
    headers['X-ECAPI-Sign']      = null;

    try {
        var token = wx.getStorageSync('t')
        if (token&&token.length > 0) {
            headers['X-ECAPI-Authorization'] = token;
        }
    } catch (e) {
        // Do something when catch error
    }

    function sortObjectKeys(obj) {
        var keys = Object.keys(obj);
        keys.sort();
        return keys;
    }

    
    if(params == undefined ){
        params = {};    
    }
    if(CONFIG.ENCRYPTED)
    {
        var resultKeys = sortObjectKeys(params);
        var resultStr = "";
        for (var i = 0; i < resultKeys.length; ++i) {
            if (i > 0) {
                resultStr += "&";
            }
            var resultKey = resultKeys[i];
            var resultValue = params[resultKey];

            resultValue = encodeURIComponent(resultValue)
                .replace("!", "%21")
                .replace("*", "%2A")
                .replace("(", "%28")
                .replace(")", "%29")
                .replace(")", "%27")
                .replace("~", "%7E");

            resultStr += resultKey + "=" + resultValue;
        }

        var timestamp = Date.parse(new Date()) / 1000 + "";
        var encryptedData = XXTEA.encryptToBase64(resultStr, xxtea_key);
        var uriEncodedData = encodeURIComponent(encryptedData)
            .replace("!", "%21")
            .replace("*", "%2A")
            .replace("(", "%28")
            .replace(")", "%29")
            .replace(")", "%27")
            .replace("~", "%7E");
        var formData = timestamp  + resultStr;
        var signData = CryptoJS.CryptoJS.HmacSHA256(formData, sign_key, {
            asBytes: false
        });

        var sign = signData.toString(CryptoJS.CryptoJS.enc.Hex);

        headers["X-ECAPI-Sign"] = sign + "," + timestamp;

        if(encryptedData && encryptedData.length > 0){
            var data = {
                'x': encryptedData
            };


        }

    }
    else{
        data = params;
    }

    if(data){
        wx.request({
            url: `${api}/${path}`,
            method:'POST',
            data: Object.assign(data),
            header: headers,
            success: appNetworkResponseResolve,
            fail: appNetworkResponseReject
        }) ;
              console.log(66666666666666666666 + "");
    }
    else{
        wx.request({
            url: `${api}/${path}`,
            method:'POST',
            header: headers,
            success: appNetworkResponseResolve,
            fail: appNetworkResponseReject
        }) ;
              console.log(7777777777777777 + "");
    }

  })
}
