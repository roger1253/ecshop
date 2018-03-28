var API = require('../../api/api.endpoint.js');
const app = getApp();
Page({
    data: {        
        show: false
    },

    //加载页面时给每个选中添加状态
    onLoad: function(option) {
        var data = this.data;
        var that = this;
        this.data.addressId = option.id;


      var products = [];
      var goods = getApp().globalData.confirmOrderData.goods;
      for (var key in goods) {
        var good = goods[key];
        var shoppingProduct = {goods_id: good.product.id, num: good.amount};
        products.push(shoppingProduct);
      };

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 30000
        });         
        var params = {};
        params.address = this.data.addressId; 
        params.products =  JSON.stringify(products);

        API.APIShipping.list(params).then(d=>{
            var data = that.data;
            data.vendors = d.data.vendors;
            that.setData(data);
            wx.hideToast();
        });        
        this.setData(data);
    },

        //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },

    //切换选择
    selectTap: function(e) {
        var data = this.data;
        data.vendors.map(function(item) {
            item.iconShow = false;
        });
        data.vendors[parseInt(e.currentTarget.id)].iconShow = true;
        getApp().globalData.confirmOrderData.shippingVender = data.vendors[parseInt(e.currentTarget.id)];
        this.setData(data);
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },
});
