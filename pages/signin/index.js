var API = require('../../api/api.endpoint.js');
var CONFIG = require('../../config/config.js');
const XXTEA = require('../../utils/xxtea.js');
var app = getApp();

Page({
    data: {},

    //加载页面时给每个选中添加状态
    onLoad: function() {            
        var data = this.data;
        this.setData(data);        
        this.tapWxaSignin();
    },

    bindUsernameInput: function(e) {
        this.setData({
            inputUsername: e.detail.value
        });
    },

    //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },
    bindPasswordInput: function(e) {
        this.setData({
            inputPassword: e.detail.value
        });
    },

    tapSignin: function(e) {
        var data = this.data;
        var that = this;
        var params = {};
        params.username = data.inputUsername;
        params.password = data.inputPassword;
        API.APIAuthBase.signin(params).then(d => {                
                var data = that.data;
                app.globalData.userInfo = d.data.user;
                app.globalData.token = d.data.token;
                wx.setStorageSync('u', d.data.user);
                wx.setStorageSync('t', d.data.token);
                wx.navigateBack({
                    delta: 1
                });
                data.loading = false;
            })
            .catch(e => {
                data.loading = false;
                console.error(e)
            })
    },
    

});
