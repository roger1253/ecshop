var API = require('../../api/api.endpoint.js');
var app = getApp();
var common = require('../../utils/util.js');
Page({
    data: {
        cashgifts: [{
        }],
        show: true,     //是否展示空页面
        per_page : 100,
        total_price : 0,
        selectCashgift : {},    //选中的红包
    },

    //加载页面时给每个选中添加状态
    onLoad: function(options) {

        var data = this.data;
        var that = this;
        that.setData({
            total_price : options.total_price,
        })

        that.getCashgiftAvailable();
        this.setData(data);
    },
    //下拉刷新
    onPullDownRefresh: function(){
        this.getCashgiftAvailable();
         wx.stopPullDownRefresh()  
    },

    getCashgiftAvailable: function(){
        var data = this.data;
        var that = this;
        var params = {};
        params.page = 1;
        params.per_page = data.per_page;
        params.total_price = data.total_price;
        API.APICashgiftAvailable.getCashgiftAvailable(params).then(d=>{
            if (d.data.cashgifts.length) {
                d.data.cashgifts.map(function(item) {
                    item.effective = common.formatTime(item.effective);
                    item.expires = common.formatTime(item.expires);
                })
                //有数据时，默认选中第一个item
                that.setData({
                    cashgifts: d.data.cashgifts,
                    show : false,
                    selectCashgift:d.data.cashgifts[0],
                });
                var pages = getCurrentPages();
                var prevPage = pages[pages.length-2];
                prevPage.setData({
                    cashgift : data.selectCashgift,        
                });
                data.cashgifts[0].iconShow = true;
            } else {
                that.setData({
                    show : true
                }); 
            }  
        });
    },


    //切换选择
    selectTap: function(e) {
        var data = this.data;
        data.cashgifts.map(function(item) {
            item.iconShow = false;
        });
        data.cashgifts[parseInt(e.currentTarget.id)].iconShow = true;
        data.selectCashgift = data.cashgifts[parseInt(e.currentTarget.id)];
        this.setData(data);

        var pages = getCurrentPages();
        var prevPage = pages[pages.length-2];
        prevPage.setData({
            cashgift : data.selectCashgift,        
        })
        wx.navigateBack({
            delta: 1,
        })
    },

    noUseCashgift : function(e){
        var data = this.data;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length-2];
        prevPage.setData({
            cashgift : null,        
        })
        wx.navigateBack({
          delta: 1,
        })
        
        this.setData(data);
    }

});
