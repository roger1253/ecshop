var common = require('../../utils/util.js');
var API = require('../../api/api.endpoint.js');
const ENUM = require('../../utils/enum.js');
const app = getApp();
Page({
    data: {
        //默认地址
        defaultAddress: { },
        //无地址时
        showAddress: false,
        total_price : 60,
        cashgift : null,    //选中的红包
        cashgiftDesc : "未选中红包",
        showInvoice : false ,   //是否显示发票，当无发票内容是，就不显示发票选项
        invoiceType : {},      //发票类型ID
        invoiceContent : {},   //发票内容
        invoiceTitle : "" ,    //发票抬头内容
        noInvoice : false,
        merchantCashgift : "0.00",      //商家红包金额
        comment: "",
        all_discount :   0 ,    //总共的优惠金额
        shipping : "" ,//选择的快递方式
        showCashgift: false,
    },

    onLoad: function(options){
        var data = this.data;
        var that = this;
        //onLoad的时候将已选中的快递方式制为null
        getApp().globalData.confirmOrderData.shippingVender = "";
        //进入页面时，获取地址列表，找到默认地址
        //调用应用实例的方法获取全局数据

        if (app.globalData && app.globalData.config && app.globalData.config.feature ) {
          this.data.showCashgift = app.globalData.config.feature.cashgift;
          // this.data.showInvoice = app.globalData.config.feature.invoice;
        }

        this.reloadAddress();
        this.getInvoiceContent();
        data.confirmType = options.type;
        this.initData(data.confirmType);
        that.setData(data);
    },

    //下拉刷新
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh()  
    },

    initData:function(type){
        var data = this.data;
        var that = this;

        if(type == ENUM.CONFIRM_PRODUCT){
            data.goods = [];
            if(getApp().globalData.confirmProductData.product){
                var card_good = {};
                card_good.product = getApp().globalData.confirmProductData.product;
                var attrs = getApp().globalData.confirmProductData.attrs;
                card_good.property = "";
                card_good.attrs = [];
                var product_price = parseFloat(card_good.product.current_price);

                var attrsLength = attrs.length;
                for (var i = 0; i < attrsLength; i++) {

                    var propertiesLength = card_good.product.properties.length;
                    for (var j = 0; j < propertiesLength; j++) {

                        var property = card_good.product.properties[j];
                        var length = property.attrs.length;
                        for (var k = 0; k < length; k++) {
                            var attrItem = property.attrs[k];
                            if (parseInt(attrItem.id) == attrs[i]) {
                                if (card_good.property.length > 0) {
                                    card_good.property += "," + attrItem.attr_name;
                                } else {
                                    card_good.property = attrItem.attr_name;
                                }
                                card_good.attrs.push(attrItem.id);
                                product_price += parseFloat(attrItem.attr_price);
                            }
                        }
                    }
                }

                card_good.amount = getApp().globalData.confirmProductData.amount;
                card_good.price = product_price;

                data.goods.push(card_good);
                getApp().globalData.confirmOrderData.goods = data.goods;
            }
        }
        else{
             data.goods =  getApp().globalData.confirmOrderData.goods;
        }
    },

    // 进入收货地址页面
    pushAddressList: function () {

        var data = this.data;

        wx.navigateTo({
            url : '../addressList/index?consigneeId=' + data.defaultAddress.id
        })
    },

    getInvoiceContent:function(){
        var that= this;
        var data = this.data;

        API.APIInvoiceContentList.getInvoiceStstua().then(d=>{
            if ( d.data.is_provided ) {
                 data.showInvoice = true;
            } else {
                data.showInvoice = false;
            }

            that.setData(data);
        });
    },

    reloadAddress:function(){
        var data = this.data;
        var that = this;
         //进入页面时，获取地址列表，找到默认地址
        //调用应用实例的方法获取全局数据
        API.APIConsignee.getConsigneeList().then(d => {

            // 判断当前数组的长度，如果为空那么就显示地址为空
            if ( d.data.consignees.length )
            {
                for ( var consigneesIndex in d.data.consignees )
                {
                    var totalAddress = '';

                    var consignees = d.data.consignees[consigneesIndex];

                    for ( var regionIndex in consignees.regions )
                    {
                        var region = consignees.regions[regionIndex];

                        totalAddress += region.name;
                    }

                    consignees.totalAddress = totalAddress + consignees.address;
                }

                //更新数据
                data.showAddress = true;
                //获取默认地址
                d.data.consignees.map(function(item) {
                    if (item.is_default) {
                        data.defaultAddress = item;
                    }
                });
            }
            else
            {
                //更新数据
                data.showAddress = false;
            }

            that.setData(data);
        });
    },

    touchSubmit:function () {

        var data = this.data;
        var that = this;
        var comment = data.comment;
        var invoiceType = data.invoiceType;
        var invoiceTitle = data.invoiceTitle;
        var invoiceContent = data.invoiceContent;

        var that = this;
        var goods = this.data.goods;
        var consignee = this.data.defaultAddress;
        var express = this.data.shipping;
        var coupon = this.data.coupon;
        var cashgift = this.data.cashgift;
        var score = this.data.score;

        var goodsIds = [];

        if (!goods || !goods.length) {
            wx.showToast({
                title: '商品信息不存在',
                icon: 'success',
                duration: 3000
            });
            return;
        }

        for (var i = 0; i < goods.length; ++i) {
            goodsIds.push(goods[i].id);
        }

        if (!goodsIds || !goodsIds.length) {
            wx.showToast({
                title: '商品信息不存在',
                icon: 'success',
                duration: 3000
            });
            return;
        }

        if (!consignee) {
            wx.showToast({
                title: '请填写地址',
                icon: 'success',
                duration: 3000
            });
            return;
        }

        if (!express) {
            wx.showToast({
                title: '请选择配送方式',
                icon: 'success',
                duration: 3000
            });
            return;
        }

        var params = {
            shop: 1,
            consignee: consignee ? consignee.id : null,
            cart_good_id: goodsIds ? JSON.stringify(goodsIds) : null,
            shipping: express ? express.id : null,
            invoice_type: invoiceType ? invoiceType.id : null,
            invoice_title: invoiceTitle,
            invoice_content: invoiceContent ? invoiceContent.id : null,
            coupon: coupon ? coupon.id : null,
            cashgift: cashgift ? cashgift.id : null,
            score: score?score:0,
            comment: comment?comment:""
        };

        if(data.confirmType == ENUM.CONFIRM_PRODUCT){
            for (var key in this.data.goods)
            {
                var good = this.data.goods[key];
                params.product = good.product.id;
                params.property = JSON.stringify(good.attrs);
                params.amount = good.amount;
            }
            API.APIProduct.purchase(params)
            .then(function (result) {
                var order = result.data.order;
                if (order) {
                    // 如果订单状态是待发货，那么就跳转到支付成功页面
                    if ( order.status == 1 ) {
                        var url = '../paySuccess/index?orderID=' + order.id;
                        wx.navigateTo({
                            url: url
                        });
                    }
                    else {
                        var url = '../payment/index?id='+order.id;
                        wx.navigateTo({
                            url: url
                        });
                    }
                }
            });
        }
        else{
            API.APICart
            .checkout(params)
            .then(function (result) {
                var order = result.data.order;
                if (order) {
                    // 如果订单状态是待发货，那么就跳转到支付成功页面
                    if ( order.status == 1 ) {
                        var url = '../paySuccess/index?orderID=' + order.id;
                        wx.navigateTo({
                            url: url
                        });
                    }
                    else {
                        getApp().globalData.confirmOrderData = {};
                        var url = '../payment/index?id='+order.id;
                        wx.navigateTo({
                            url: url
                        });
                    }
                }
            });
        }
    },

    _reloadPrice:function () {
        var that = this;
        var goods = this.data.goods;
        var consignee = this.data.defaultAddress;
        var express = this.data.shipping;
        var coupon = this.data.coupon;
        var cashgift = this.data.cashgift;
        var score = this.data.score;

        if (!goods || !goods.length) {
            wx.showToast({
            title: '商品信息不存在',
            icon: 'warn',
            duration: 3000
            });
            return;
        }

        if (!consignee) {
            return;
        }

        var products = [];
        if(this.data.confirmType == ENUM.CONFIRM_ORDER){
            for (var i = 0; i < goods.length; ++i) {
                products.push({
                    goods_id: goods[i].product.id,
                    property: goods[i].attrs.split(','),
                    num: goods[i].amount
                });
            }
        }
        else{
            for (var key in this.data.goods) {
                var good = this.data.goods[key];
                var shoppingProduct = {
                    goods_id: good.product.id,
                    property: good.attrs,
                    num: good.amount,
                    total_amount: good.amount
                };
                products.push(shoppingProduct);
            }
        }


        var params = {};

        params.order_product = JSON.stringify(products);

        if (consignee&&consignee.id) {
            params.consignee = consignee.id;
        }

        if (express) {
            params.shipping = express.id;
        }

        if (cashgift) {
            params.cashgift = cashgift.id;
        }

        if (coupon) {
            params.coupon = coupon.id;
        }

        if (score) {
            params.score = score;
        }

        API.APIOrder.price(params)
            .then(function (result) {
                var data = that.data;
                var all_discount = 0;
                data.order_price = result.data.order_price;
                result.data.order_price.promos.forEach(function(item,index){
                    if (item.promo == "cashgift") {
                        data.merchantCashgift = item.price;
                    };
                  all_discount =  parseFloat(all_discount) + parseFloat(item.price);
                })
                // for(var promo in result.data.order_price.promos){

                //     if (promo.promo == "cashgift") {
                //         data.merchantCashgift = promo.price;
                //     }
                //     data.all_discount += parseFloat(result.data.promos[promo].price);
                // }
                data.all_discount = all_discount;
                that.setData(data);

            });
    },

    _reloadScore:function () {

        $scope.maxUseScore = 0;

        for (var i = 0; i < $scope.goods.length; ++i) {
            $scope.maxUseScore += $scope.goods[i].product.score*$scope.goods[i].amount;
        }

        API.score
            .get({})
            .then(function (info) {
                $scope.scoreInfo = info;
                $scope.refreshScore();
            })
    },

    touchShipping:function(){
            var url = '../shipping/index?id='+this.data.defaultAddress.id;
            wx.navigateTo({
                url: url
            });
    },

    //当页面可见时，就获取选中的红包信息
    onShow: function(){
        var data = this.data;
        var that = this;
        if(data.cashgift){
            data.cashgiftDesc = data.cashgift.value + "元"
        }
        that.data.shipping = getApp().globalData.confirmOrderData.shippingVender;
        that.setData(data);
        that._reloadPrice();
    }
})
