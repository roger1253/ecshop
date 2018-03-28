var common = require('../../utils/util.js');
var API = require('../../api/api.endpoint.js');
const ENUM = require('../../utils/enum.js');
const app = getApp();

Page({
    data: {
        //购物车是否为空
        show: false,
        //商品全选状态
        type: 'circle',

        //总价格
        totalPrice: 0,

        //总数量
        totalAmount: 0,

        //二次确认隐藏
        modalHidden: true,
        modalHiddenAll: true,
        //选中的数组
        selectedArr: [],

        //删除的商品的id
        deleteItem: '',
        items : [],
    },

    //加载页面时给每个选中添加状态
    onLoad: function() {

    },

      //下拉刷新
    onPullDownRefresh: function(){
         this.getCartList();
         wx.stopPullDownRefresh()  
    },

    onShow: function() {
        this.getCartList();
    },

    getCartList:function(){
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        API.APICart._get().then(d=>{
            var data = that.data;

            if(d.data.goods_groups.length){

                for (var i = d.data.goods_groups[0].goods.length - 1; i >= 0; i--)
                {
                    var tempGood = d.data.goods_groups[0].goods[i];
                    tempGood.type = 'circle';

                }

            }




            data.goods_groups = d.data.goods_groups;

            // 如果有数据 那么就显示
            if ( d.data.goods_groups.length )
            {
                data.show = false;
            }
            else
            {
                data.show = true;
            }
            data.selectedArr = [];
            data.type = 'circle';

            that.setData(data);
            that.recomputePrice();
            wx.hideToast();
        });
    },


    //添加数量
    tapAdd: function(e) {
        var that = this;
        var item = this.data.goods_groups[0].goods[parseInt(e.currentTarget.id)];

        //如果要修改的数量大于商品的库存数量 则弹出库存不足提示
        if (item.attr_stock < item.amount + 1) {
              wx.showToast({
                    title: '库存不足'
                });

          } else {
            wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
            });
            var params = {}
            params.good = item.id;
            params.amount = item.amount + 1;
            API.APICart._update(params).then(d=>{
                that.recomputePrice();
                wx.hideToast();
            });
          }

    },

    recomputePrice:function(){
        var that = this;
        API.APICart._get().then(d=>{
            var data = that.data;
            data.goods_groups = d.data.goods_groups;
            if(data.goods_groups.length){

                for (var i = data.goods_groups[0].goods.length - 1; i >= 0; i--)
                {
                    var tempGood = data.goods_groups[0].goods[i];
                    tempGood.type = 'circle';
                    for (var j = data.selectedArr.length - 1; j >= 0; j--) {
                        var itemGood = data.selectedArr[j];
                        if(tempGood.id == itemGood.id){
                            tempGood.type = 'success';
                            data.selectedArr[j] = tempGood;
                        }
                    }

                }

            }
            data.totalPrice = common.total(data.selectedArr).totalPrice;
            data.totalAmount = common.total(data.selectedArr).totalAmount;
            that.setData(data);

        });
    },
    //减少数量
    tapSub: function(e) {
        var that = this;
        var data = this.data;
        if(this.data.goods_groups.length){
            wx.showToast({
                title: '加载中',
                icon: 'loading',
                duration: 10000
            });
            var item = this.data.goods_groups[0].goods[parseInt(e.currentTarget.id)];
            var params = {}
            params.good = item.id;
            params.amount = item.amount - 1;
            API.APICart._update(params).then(d=>{
                that.recomputePrice();
                wx.hideToast();
        });
        }
    },
    //填写数量
    bindInput: function(e) {

        if(e.detail.value.length == 0){
            return;
        }

        var data = this.data;
        var item = this.data.goods_groups[0].goods[parseInt(e.currentTarget.id)];
        this.setData(data);

        var params = {}
        params.good = item.id;
        params.amount = e.detail.value;
        API.APICart._update(params).then(d=>{
            var data = that.data;
            data.goods_groups = d.data.goods_groups;
            that.setData(data);
            that.recomputePrice();
        });
    },
    bindblur:function(e){
        if(e.detail.value.length != 0){
            return;
        }
        e.detail.value = 0;
        var data = this.data;
        var item = this.data.goods_groups[0].goods[parseInt(e.currentTarget.id)];
        this.setData(data);

        var params = {}
        params.good = item.id;
        params.amount = e.detail.value;
        API.APICart._update(params).then(d=>{
            var data = that.data;
            data.goods_groups = d.data.goods_groups;
            that.setData(data);
            that.recomputePrice();
        });
    },

    //单个选中和取消
    tapSelect: function(e) {
        var data = this.data;
        var targetIndex = parseInt(e.currentTarget.id);
        var targetGood = this.data.goods_groups[0].goods[targetIndex];
        var type = targetGood.type;

        if (type == 'success') {
            //如果是选中状态从数组中移除
            var item = targetGood;
            var index = common.indexOf(data.selectedArr, item);
            data.selectedArr.splice(index, 1);
            targetGood.type = 'circle';
            this.setData(data);
        } else {
            targetGood.type = 'success';
            //如果是未选中状态添加到数组中
            data.selectedArr.push(targetGood);
            console.log(data.selectedArr);
            this.setData(data);
        }


        if (data.selectedArr.length == this.data.goods_groups[0].goods.length) {
            data.type = 'success';
            this.setData(data);
        } else {
            data.type = 'circle';
            this.setData(data);
        }

        data.totalPrice = common.total(data.selectedArr).totalPrice;
        data.totalAmount = common.total(data.selectedArr).totalAmount;
        this.setData(data);
    },

    //全选
    selectAll: function(e) {
        var data = this.data;
        var type = this.data.type;
        if (type == 'circle') {
            data.type = 'success';
            data.selectedArr = this.data.goods_groups[0].goods;
            this.setData(data);
        } else {
            data.type = 'circle';
            data.selectedArr = [];
            this.setData(data);
        };

        data.totalPrice = common.total(data.selectedArr).totalPrice;
        data.totalAmount = common.total(data.selectedArr).totalAmount;
        this.setData(data);
        this.recomputePrice();
    },

    isSelect:function(selectItem){
        //再购物车全部商品中删除选中的
        this.data.selectedArr.map(function(item, index) {
            {
                if(selectItem.id == item.id){
                    return true;
                }
            }
        })
        return false;
    },

    //删除二次确认
    modalTap: function(e) {
        var deleteItem = this.data.goods_groups[0].goods[parseInt(e.currentTarget.id)];
        this.setData({
            modalHidden: false,
            deleteItem: deleteItem
        })
    },

    modalTapAll: function(e) {
        // var deleteItem = this.data.items[parseInt(e.currentTarget.id)];
        this.setData({
            modalHiddenAll: false,
        })
    },

    //确认删除
    confirm: function() {
        var data = this.data;
        var that = this;
        data.modalHidden = true;
        this.setData(data);

        var index2 = common.indexOf(data.selectedArr, data.deleteItem);
        if (index2 !== -1) {
            data.selectedArr.splice(index2, 1);
            data.totalPrice = common.total(data.selectedArr).totalPrice;
            data.totalAmount = common.total(data.selectedArr).totalAmount;
            this.setData(data);
        }

        var params = {}
        params.good = data.deleteItem.id;
        API.APICart._delete(params).then(d=>{
            var data = that.data;

            if(d.data.goods_groups){
                data.goods_groups = d.data.goods_groups;
            }
            that.setData(data);
              //判断是否删除完了
            if (data.goods_groups[0].goods.length == 0) {
                this.setData({
                    show: true,
                    type: 'circle'

                })
            }
            that.recomputePrice();
        });

    },

    //取消
    cancel: function() {
        this.setData({
            modalHidden: true
        })
    },

    touchConfirmOrder :function(){
        getApp().globalData.confirmOrderData.goods = this.data.selectedArr;
        var url = '../confirmOrder/index?type='+ENUM.CONFIRM_ORDER;
        wx.navigateTo({
            url: url
        });
    },

    confirmAll: function() {
        var data = this.data;

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });


        API.APICart._clear().then(d=>{
            wx.hideToast();
            //再购物车全部商品中删除选中的
            data.selectedArr.map(function(item, index) {
                if (common.indexOf(data.items, item) !== -1) {
                    data.items.splice(common.indexOf(data.items, item), 1);
                }
            })

            //清空选中
            data.selectedArr = [];
            this.setData(data);

            //计算总价
            data.totalPrice = common.total(data.selectedArr).totalPrice;
            data.totalAmount = common.total(data.selectedArr).totalAmount;
            data.type = 'circle';

            data.modalHiddenAll = 'true';

            //如果删除完了显示空页面
            if( data.items.length == 0 ) {
                data.show = true;
            }

            this.setData(data);
        });
    },

    cancelAll: function() {
        this.setData({
            modalHiddenAll: true
        })
    },

})
