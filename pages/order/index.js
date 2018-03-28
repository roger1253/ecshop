var common = require('../../utils/util.js');

var API = require('../../api/api.endpoint.js');

Page({
    data: {
        // 订单状态
        ORDER_STATUS :
        {
            ORDER_STATUS_CREATED : '0', // 待付款
            ORDER_STATUS_PAID : '1', // 待发货
            ORDER_STATUS_DELIVERING : '2', // 待收货
            ORDER_STATUS_DELIVERIED : '3', // 已收货，待评价
            ORDER_STATUS_FINISHED : '4', // 已完成
            ORDER_STATUS_CANCELLED : '5', // 已取消
            ORDER_STATUS_ALL : '10', //全部
        },

        orders: [],

        //取消订单二次确认
        orderModal: true,
        //确认收货二次确认
        receiptModal: true,

        types: [
            { name: '全部', active: true }, { name: '待付款', active: true }, { name: '待发货', active: true }, { name: '待收货', active: true }
        ],

        currentOrderStatus:0,
        currentOrder:{

        },

        show: false,
        isMore:false,   //是否有更多
        offset : 1, 
    },

    // 下拉刷新
    onPullDownRefresh: function(){
        this.getOrderList(true);
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {
        var isMore = this.data.isMore;
        if ( isMore == 1 ) 
        {
            this.getOrderList(false);
        }
    },

    onLoad: function(param) {
        var e = {};
        e.currentTarget = {};
        e.currentTarget.id = param.index;
        this.tapOrderType(e);
    },

    //当页面可见时，就获取选中的红包信息
    onShow: function(){
        this.getOrderList(true);
    },

    // 切换订单类型
    tapOrderType: function(e) {
        var data = this.data;

        data.types.map(function(type, index) {
            type.active = false;
        })

        var index = parseInt(e.currentTarget.id);

        if ( !index )
        {
            index = 0;
        }

        var typeTitleData = data.types[index]
        typeTitleData.active = true;
        this.setData(data);

        this.data.currentOrderStatus = parseInt(e.currentTarget.id);

        this.getOrderList(true);
    },

    //取消订单二次确认
    cancelOrderTap: function(e) {
        var cancelOrder = this.data.orders[parseInt(e.currentTarget.id)];
        this.data.currentOrder = cancelOrder;
        this.setData({
            orderModal: false,
            cancelOrder: cancelOrder
        })
    },
    orderYes: function() {
        this.setData({
            orderModal: true,
        })

        wx.showToast({
            title: '请求中',
            icon: 'loading',
            duration: 10000
        });

        var params = {};
        params.order = this.data.currentOrder.id;
        params.reason = '1';

        API.APIOrder.cancelOrder(params).then(d => {
            wx.hideToast();
            // 刷新列表
            this.getOrderList(true);
        })      
    },
    orderNo: function() {
        this.setData({
            orderModal: true,
        })
    },
    //确认收货二次确认
    receiptTap: function(e) {
        var receiptOrder = this.data.orders[parseInt(e.currentTarget.id)];
        this.data.currentOrder = receiptOrder;
        this.setData({
            receiptModal: false,
            receiptOrder: receiptOrder
        })
    },
    receiptYes: function(e) {
        this.setData({
            receiptModal: true,
        })

        wx.showToast({
            title: '请求中',
            icon: 'loading',
            duration: 10000
        });

        var params = {};
        params.order = this.data.currentOrder.id;

        API.APIOrder.confirmOrder(params).then(d => {
            wx.hideToast();

            wx.navigateTo({
                url: '../receiptSuccess/index?orderID=' + this.data.currentOrder.id
            })
        })
    },
    receiptNo: function() {
        this.setData({
            receiptModal: true,
        })
    },

    //查看物流
    expressMessage: function(e) {
        var order = this.data.orders[parseInt(e.currentTarget.id)];
        wx.navigateTo({
            url: '../expressMessage/index?orderId=' + order.id
        })
    },

    // 评价
    evaluateTap: function () {
        
    },

    // 微信支付
    payTap: function (e) {
        var order = this.data.orders[parseInt(e.currentTarget.id)];
        var params = {};
        params.order = order.id; // 订单id
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
                    // 交易成功
                    wx.navigateTo({
                        url: '../paySuccess/index?orderID=' + order.id
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

    // 进入订单详情页面
    pushOrderDetailTap: function(e) {
        var order = this.data.orders[parseInt(e.currentTarget.id)];
        wx.navigateTo({
          url : '../orderDetail/index?orderID=' + order.id
        })
    },

    // 获取订单列表
    getOrderList: function(isFirstPage) {
        var params = {};
        var index = this.data.currentOrderStatus;

        if ( isFirstPage )
        {
            // 下拉刷新
            this.data.offset = 1;
            params.page = this.data.offset;
            params.per_page = 10;
        }
        else
        {
            // 上拉加载
            params.page = this.data.offset;
            params.per_page = 10;
        }

        if ( index == 0 )
        {
            params.status = this.data.ORDER_STATUS.ORDER_STATUS_ALL;
        }
        else if ( index == 1 ) 
        {
            params.status = this.data.ORDER_STATUS.ORDER_STATUS_CREATED;
        }
        else if ( index == 2 ) 
        {
            params.status = this.data.ORDER_STATUS.ORDER_STATUS_PAID;
        }
        else if ( index == 3 ) 
        {
            params.status = this.data.ORDER_STATUS.ORDER_STATUS_DELIVERING;
        }
        else if ( index == 4 ) 
        {
            params.status = this.data.ORDER_STATUS.ORDER_STATUS_DELIVERIED;
        }            
        else
        {
            params.status = this.data.ORDER_STATUS.ORDER_STATUS_PAID;
        }

        API.APIOrderList.getOrderList(params).then(d => {
            this.setData({
                orders : this.reloadViewData(d.data.orders, isFirstPage),
                isMore : d.data.paged.more,
                offset : this.data.offset 
            })
        })
    },

    // 处理商品数据
    reloadViewData : function ( orders, isFirstPage ) {

        if ( isFirstPage )
        {
            // 下拉刷新
            this.data.offset = 1;
        }
        else
        {
            // 上拉加载
            orders = this.data.orders.concat(orders);
        }

        this.data.offset += 1;

        for ( var orderIndex in orders )
        {
            var order = orders[orderIndex];

            // 设置订单中商品总件数
            var totalAmount = 0;
            for ( var goodIndex in order.goods )
            {
                var orderGoods = order.goods[goodIndex];
                 totalAmount += orderGoods.total_amount;
            }

            order.total_goods = totalAmount;

            // 定义订单状态
            if ( order.status == 0 )
            {
                order.typeTitle = '等待买家付款';
            }
            else if ( order.status == 1 )
            {
                order.typeTitle = '等待卖家发货';
            }
            else if ( order.status == 2 )
            {
                order.typeTitle = '等待卖家收货';
            }
            else if ( order.status == 3 || order.status == 4 )
            {
                order.typeTitle = '交易成功';
            }
            else if ( order.status == 5 )
            {
                order.typeTitle = '交易关闭';
            }

            for ( var orderGoodIndex in order.goods )
            {
                var orderGood = order.goods[orderGoodIndex];

                // 商品属性 去除换行
                orderGood.property = orderGood.property.replace(/[\r\n]/g,"");
            }
        }

        return orders;
    }

});
