var API = require('/api/api.endpoint.js');

//app.js
App({
  pid: undefined,
  onLaunch: function () {
    console.log('App Launch');
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.token = wx.getStorageSync('t', null);
    this.globalData.userInfo = wx.getStorageSync('u', null);
    this.globalData.openid = wx.getStorageSync('o', null);

  },


  getUserInfo: function () {
    // console.log('userInfo :' + JSON.stringify(this.globalData.userInfo));
    return this.globalData.userInfo;
  },
  login: function () {
    var that = this;
    //调用登录接口
    var url = '../signin/index';
    wx.navigateTo({
      url: url
    });
  },
  isLogin: function () {
    return this.globalData.token ? true : false;
  },
  onShow: function ({ query }) {
    console.log('App Show')
    const { pid } = query
    if (pid !== undefined) {
      this.pid = pid
    }
  },
  onHide: function () {
    console.log('App Hide')
  },
  cartTotal: function () {
    var count = 0;
    if (this.globalData.cartData) {
      if (this.globalData.cartData.goods) {
        var goods = this.globalData.cartData.goods;
        for (var j = 0; j < goods.length; ++j) {
          count += goods[j].amount;
        }
        this.globalData.cartData.cartTotal = count;
        return count;
      }

    }
    return 0;
  },

  globalData: {
    userInfo: null,
    token: null,
    confirmOrderData: {},
    confirmProductData: {},
    cartData: { 'cartTotal': 0 },
    config: {}
  }
})
