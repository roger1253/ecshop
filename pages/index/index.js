//index.js
//获取应用实例
var API = require('../../api/api.endpoint.js');

const XXTEA = require('../../utils/xxtea.js');

const app = getApp();

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 200,
    inputFocus: false,
    inputValue: "",
    title: '加载中...',
    loading: false,
  },
  onShareAppMessage: function () {
    return {
      title: 'ecshop商城',
      path: 'pages/index/index'
    }
  },
  onScan() {
    wx.scanCode({
      success: (res) => {
        try {
          const { result } = res
          let pid
          if (/^\d+$/.test(result)) {
            pid = result
          } else {
            pid = result.match(/pid=\d+/)[0].split('=')[1]
          }
          wx.navigateTo({
            url: `../productDetail/index?pid=${pid}`,
          })
        } catch (error) {
          console.error(error)
          wx.showModal({
            title: '错误',
            content: '请扫描正确的条形码/二维码',
            showCancel: false
          })
        }
      }
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  tapProduct: function (e) {
    var productId = parseInt(e.currentTarget.id);
    var url = '../productDetail/index?pid=' + productId;
    wx.navigateTo({
      url: url
    });
  },
  swiperchange: function (e) {
    //FIXME: 当前页码
    //console.log(e.detail.current)
  },
  onLoad: function () {
    console.log('onLoad');
    if (app.pid !== undefined) {
      wx.navigateTo({
        url: `../productDetail/index?pid=${app.pid}`,
        success: () => {
          app.pid = undefined
        }
      })
    }
    this.reload();
    this.tapWxaSignin();
    this.reloadConfig();
  },

  reloadConfig: function () {
    API.APIConfig.getConfig().then(d => {
      var xxtea_key = "getprogname()";
      var raw = XXTEA.decryptFromBase64(d.data.data, xxtea_key);
      var json = JSON.parse(raw);
      if (json) {
        app.globalData.config = json;
      }
    });
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.reload();
    wx.stopPullDownRefresh()
  },

  tapWxaSignin: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 60000
    });
    wx.login({
      success: function (res) {

        var that = this;
        var VENDER_WXA = 5;
        var params = {};
        params.vendor = VENDER_WXA;
        params.js_code = res.code;
        API.APIAuthSocial.authSocial(params).then(d => {
          var openid = d.data.openid;
          getApp().globalData.openid = openid;
          wx.setStorageSync('o', openid);
          // if(!CONFIG.FOR_WEIXIN){
          //     wx.hideToast();
          //     return;
          // }
          wx.setStorageSync('t', d.data.token);
          getApp().globalData.token = d.data.token;
          var userInfo = d.data.user;
          wx.getUserInfo({
            success: function (res) {
              var wxUserInfo = res.userInfo;
              console.log('const :' + JSON.stringify(wxUserInfo));
              wx.hideToast();
              userInfo.nickname = wxUserInfo.nickName
              var photo = {};
              photo.thumb = wxUserInfo.avatarUrl;
              photo.large = wxUserInfo.avatarUrl;
              userInfo.photo = photo;
              userInfo.gender = wxUserInfo.gender;
              wx.setStorageSync('u', userInfo);
              getApp().globalData.userInfo = userInfo;

              var params = {};
              // if (d.data.is_new_user) {
              params.nickname = userInfo.nickname;
              // }

              // var photo = {};
              // photo.thumb = wxUserInfo.avatarUrl + '';
              // photo.large = wxUserInfo.avatarUrl+ '';
              // params.avatar_url = wxUserInfo.avatarUrl;
              params.gender = userInfo.gender;

              API.APIUser._update(params).then(d => {

              });

            }
          });
        })
      }
    });
  },

  reload: function () {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 30000
    });
    API.APIBanner.getBannerList().then(d => {
      var data = that.data;
      data.banners = d.data.banners;
      that.setData(data);
    });

    //调用应用实例的方法获取全局数据
    API.APIHome.getProductList().then(d => {
      wx.hideToast();
      //更新数据
      that.setData({
        products: d.data
      });
    });
  },

  bindInput: function (e) {
    this.setData({
      inputFocus: true,
      inputValue: e.detail.value
    });
  },
  bindBlur: function (e) {
    this.setData({
      inputFocus: false,
      inputValue: ""
    });
  },
  tapCancel: function (e) {
    this.setData({
      inputFocus: false,
      inputValue: ""
    });
  },
  bindChange: function (e) {
    var url = "../searchResult/index?keyword=" + this.data.inputValue;
    wx.navigateTo({ url: url });
  },
  // bindSubmit: function(e) {
  //     console.log('form发生了submit事件，携带数据为：', e.detail.value);
  //     wx.navigateTo({ url: "../productList/index" });
  // }

})
