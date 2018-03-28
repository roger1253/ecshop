Page({
  data:{
    orderID : ''
  },

  onLoad: function(param) {
      this.data.orderID = param.orderID;
  },

      //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },

  // 进入订单详情页面
  pushOrderDetailTap: function() {
      wx.navigateTo({
        url : '../orderDetail/index?orderID=' + this.data.orderID
      })
  },
})