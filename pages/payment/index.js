var common = require('../../utils/util.js');

var API = require('../../api/api.endpoint.js');

Page({
    data: {
        show: false,
        isMore:false,   //是否有更多
        offset : 1,            
    },

    onLoad: function(param) {        
        this.data.orderId = param.id;
        this.payTap();
    },

        //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },

    // 微信支付
    payTap: function () {        
        var params = {};
        var that = this;
        params.order = that.data.orderId; // 订单id
        params.code = 'wxpay.wxa'; // 微信支付
        params.openid = getApp().globalData.openid;

        wx.showToast({
            title: '请求中',
            icon: 'loading',
            duration: 10000
        });

        // 支付
        API.APIPayment.weixinPayment(params).then(d => {
            wx.hideToast();
            wx.requestPayment({
                timeStamp: d.data.wxpay.timestamp,
                nonceStr: d.data.wxpay.nonce_str,
                package: "prepay_id="+d.data.wxpay.prepay_id,
                signType: 'MD5',
                paySign: d.data.wxpay.sign,
                success: function(res){
                    // 交易成功  关闭当前页面，然后进入下级页面
                    wx.redirectTo({
                      url: '../paySuccess/index?orderID=' + that.data.orderId
                    })
                },
                fail: function() {
                    // fail
                },
                complete: function() {
                    // complete
                }
            })
        })
    },

    backHome: function () {
        wx.navigateBack({
            delta: 5
        })
    },

    // 进入订单详情页面
    pushOrderDetailTap: function(e) {
        wx.navigateTo({
          url : '../orderDetail/index?orderID=' + this.data.orderId
        })
    },
});
