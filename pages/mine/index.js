var API = require('../../api/api.endpoint.js');
//获取应用实例
var app = getApp()
Page( {
  data: {
    userInfo: {},
    showName:"",
    userAvatarUrl: '',
    showCashgift: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo( {
      url: '../logs/logs'
    })
  },
  touchLogin:function(){
    wx.navigateTo( {
      url: '../signin/index'
    })
  },
  onLoad: function() {
    var data = this.data;
    var that = this;
    var token = wx.getStorageSync('t')

    if (app.globalData && app.globalData.config && app.globalData.config.feature && app.globalData.config.feature.cashgift ) {
      this.data.showCashgift = app.globalData.config.feature.cashgift;
      that.setData(data);
    }
  },

     //下拉刷新
  onPullDownRefresh: function(){
       this.getUserInfo();
       wx.stopPullDownRefresh()  
  },

  //每次可见都获取用户资料
  onShow:function(){
      this.getUserInfo();
  },

  getUserInfo: function(){
    var data = this.data;
      var that = this;
        var token = wx.getStorageSync('t')
        if (token&&token.length > 0) {
        wx.getUserInfo({
          success: function(res){
            that.setData({
              userAvatarUrl : res.userInfo.avatarUrl,
            });
          },
        })
    
            API.APIProfileGet.getUserProfile().then(d=>{
            that.setData({
              userInfo : d.data.user,
            });
            if (data.userInfo.nickname) {
              data.showName = data.userInfo.nickname;
            } else {
              data.showName = data.userInfo.username;
            }
            // data.userAvatarUrl = data.userInfo.avatar.large;
            that.setData(data);
          });            
        }
  },

  pushMyInfo: function () {
    if ( !this.data.userInfo.id ) {
      wx.showToast({
          title: '请登陆'
      });
      this.touchLogin();

    }
    else
    {
      wx.navigateTo({
        url: '../myInfo/index'
      })
    }
  },

  pushAllOrderList: function () {
    wx.navigateTo({
      url: '../order/index?index=' + "0",
    })
  },

  // 跳转到订单列表页面
  pushOrderListCreated: function () {
    wx.navigateTo({
      url: '../order/index?index=' + "1",
    })
  },

  pushOrderListPaid: function () {
    wx.navigateTo({
      url: '../order/index?index=' + "2",
    })
  },

  pushOrderListDelivering: function () {
    wx.navigateTo({
      url: '../order/index?index=' + "3",
    })
  },

  

})