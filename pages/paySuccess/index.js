Page({
  data:{
    orderID : ''
  },

  onLoad: function(param) {
      this.data.orderID = param.orderID;
  },

  backHome: function () {
      wx.navigateBack({
          delta: 6
      })
  },

    //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },
  // 进入订单详情页面
  pushOrderDetailTap: function() {
    // 交易成功  关闭当前页面，然后进入下级页面
    wx.redirectTo({
        url : '../orderDetail/index?orderID=' + this.data.orderID
    })
  },
})