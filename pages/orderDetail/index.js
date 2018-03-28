var common = require('../../utils/util.js');
var timeFunction = require('../../utils/timeFunction.js');
var API = require('../../api/api.endpoint.js');

Page({
    data: {
        //假设0为待付款，1为待收货
        defaultAddress: { name: "小布丁", mobile: "1888234765356", detail: '北京市朝阳区 朝外大街乙6号 朝外SOHO A座 807朝外SOHO A座 807' },
        order: {
        },

        orderStatusTitle:'',
        totalAddress: '',

        shippingDescs :[],

        //取消订单二次确认
        orderModal: true,
        //确认收货二次确认
        receiptModal: true,
        orderId : 0,        //订单ID
    },

    onLoad: function(param) {
        var orderID = param.orderID;
        this.setData({
            orderID:orderID,
        });
        this.getOrderInfo(param.orderID)
    },

       //下拉刷新
    onPullDownRefresh: function(){
       this.getOrderInfo(this.data.orderID);
       wx.stopPullDownRefresh()  
    },

    // 待付款订单操作
    //取消订单二次确认
    cancelOrderTap: function(e) {
        this.setData({
            orderModal: false,
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
        params.order = this.data.order.id;
        params.reason = '1';

        API.APIOrder.cancelOrder(params).then(d => {
            wx.hideToast();
            // 返回上级页面
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
        })
    },
    orderNo: function() {
        this.setData({
            orderModal: true,
        })
    },

    //确认收货二次确认
    receiptTap: function(e) {
        this.setData({
            receiptModal: false,
        });
    },
    receiptYes: function() {
        this.setData({
            receiptModal: true,
        })

        wx.showToast({
            title: '请求中',
            icon: 'loading',
            duration: 10000
        });

        var params = {};
        params.order = this.data.order.id;

        API.APIOrder.confirmOrder(params).then(d => {
            wx.hideToast();
            wx.navigateTo({
                url: '../receiptSuccess/index?orderID=' + this.data.order.id
            })
        })
    },
    receiptNo: function() {
        this.setData({
            receiptModal: true,
        })
    },

    //查看物流
    expressMessage: function() {
        wx.navigateTo({
            url: '../expressMessage/index?orderId=' + this.data.order.id
        })
    },

    // 微信支付
    payTap: function (e) {
        var order = this.data.order;
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

    // 获取订单详情
    getOrderInfo: function (orderId) {
        // 支付
        var params = {};
        params.order = orderId; // 订单id

        wx.showToast({
            title: '请求中',
            icon: 'loading',
            duration: 10000
        });

        API.APIOrder.getOrderInfo(params).then(d => {
            wx.hideToast();
            this.reloadViewData(d.data.order);
        })
    },

    // 设置页面数据
    reloadViewData: function (order) {

        // 设置订单状态
        var currentOrderStatusTitle = '';

        if ( order.status == 0 ) 
        {
            currentOrderStatusTitle = '等待买家付款';
        }
        else if ( order.status == 1 ) 
        {
            currentOrderStatusTitle = '等待卖家发货';
        }
        else if ( order.status == 2 ) 
        {
            currentOrderStatusTitle = '等待买家收货';
        }
        else if ( order.status == 3 || order.status == 4 ) 
        {
            currentOrderStatusTitle = '交易成功';
        }
        else if ( order.status == 5 ) 
        {
            currentOrderStatusTitle = '交易关闭';
        }

        var promos = [];
        // 设置当前的促销相关的价格信息
        for ( var promoIndex in order.promos )
        {
            var promo = order.promos[promoIndex];

            var isAdd = true;

            if ( promo.promo == "preferential" )
            {
                promo.promo = "优惠金额";
            }
            else if ( promo.promo == "cashgift" )
            {
                promo.promo = "商家红包";
            }
            else if ( promo.promo == "score" )
            {
                isAdd = false;
                // 隐藏掉积分抵现
                promo.promo = "积分抵现";
            }
            else if ( promo.promo == "coupon_reduction" )
            {
                promo.promo = "优惠券减免";
            }
            else if ( promo.promo == "goods_reduction" )
            {
                promo.promo = "商品减免";
            }
            else if ( promo.promo == "order_reduction" )
            {
                promo.promo = "订单减免";
            }

            if ( isAdd )
            {
                promos.push(promo);
            }
        }

        order.promos = promos;

        // 描述
        var sn = '订单编号：' + order.sn;
        var shippingCode = '快递单号：' + order.shipping.tracking;
        var createdAt = '创建时间：' + timeFunction.getLocalTime(order.created_at);
        var paiedAt = '付款时间：' + timeFunction.getLocalTime(order.paied_at);
        var deliverAt = '发货时间：' + timeFunction.getLocalTime(order.shipping_at);
        var finishAt = '成交时间：' + timeFunction.getLocalTime(order.finish_at);
        var endAt = '关闭时间：' + timeFunction.getLocalTime(order.canceled_at);

        var datas = [];
        if ( order.status == 0 )
        {
            // 待付款   订单编号  创建时间
			datas = [sn, createdAt];
        }
        else if ( order.status == 1 )
        {
			// 待发货  订单编号  创建时间   付款时间
			datas = [sn, createdAt, paiedAt];
        }
        else if ( order.status == 2 )
        {
			// 待收货  订单编号  快递单号  创建时间  付款时间  发货时间
			datas = [sn, shippingCode, createdAt, paiedAt, deliverAt];
        }
        else if ( order.status == 5 )
        {
			// 已取消 订单编号  创建时间  关闭时间
			datas = [sn, createdAt, endAt];
        }
        else if ( order.status == 3 || order.status == 4 )
        {
			// 待评价  订单编号  快递单号  创建时间  付款时间 发货时间  成交时间
			datas = [sn, shippingCode, createdAt, paiedAt, deliverAt, finishAt];
        }

        for ( var orderGoodIndex in order.goods )
        {
            var orderGood = order.goods[orderGoodIndex];

            // 商品属性 去除换行
            orderGood.property = orderGood.property.replace(/[\r\n]/g,"");
        }

        this.setData({
            order: order,
            orderStatusTitle: currentOrderStatusTitle,
            shippingDescs:datas,
        })
    }
});
