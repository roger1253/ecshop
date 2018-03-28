
var timeFunction = require('../../utils/timeFunction.js');
var API = require('../../api/api.endpoint.js');

Page({
    data: {
        status:[],
        vendor_name:'',
        code: '',
        orderId : 0,
    },

    onLoad: function(param) {
        var getOrderId = param.orderId;
        this.setData({
            orderId : getOrderId,
        })
        this.reloadShippingModel(param.orderId);
    },

        //下拉刷新
  onPullDownRefresh: function(){
    this.reloadShippingModel(this.data.orderId);
       wx.stopPullDownRefresh()  
  },

    reloadShippingModel: function(orderId) {
        var params = {};
        params.order_id = orderId;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 30000
        }); 
        API.APIShipping.getShippingStatus(params).then(d => {
            this.setData({
                status: this.reloadViewData(d.data.status),
                vendor_name:d.data.vendor_name,
                code:d.data.code
            });
            wx.hideToast();
        })
    },

    // 数组处理
    reloadViewData: function(status) {
        for ( var shippingStatusIndex in status ) 
        {
            var shippingStatus = status[shippingStatusIndex];

            shippingStatus.datetime = timeFunction.getLocalTime(shippingStstus.datetime);

            if ( shippingStatusIndex == 0 )
            {
                shippingStatus.is_last = true;
            }
            else
            {
                shippingStatus.is_last = false; 
            }
        }

        return status;
    }, 

});