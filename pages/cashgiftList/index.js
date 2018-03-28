var API = require('../../api/api.endpoint.js');
var app = getApp();
var common = require('../../utils/util.js');
Page({
    data: {
        // 红包状态
        "CASHGIFT_STATUS" :
        {
              "AVAILABLE"     : 0         // 未过期
            , "EXPIRED"         : 1         // 过期
            , "USED"            : 2         // 已使用
        },
        page : 1,          
        per_page : 10,      
        cashgifts :[{}],
        types: [
            { name: '未使用', active: true }, { name: '已过期' }, { name: '已使用' }
        ],
        selectTypes:0,      //选中的
        show: true,      //是否展示空页面
        showType : false, //是否展示红包类型。只有已过期和已使用需要展示
        isMore:false,   //是否有更多

    },

    //加载页面时转换时间戳
    onLoad: function() { 
        this.getCashgiftList(this.data.selectTypes);
        this.setData(this.data);
    },

    //下拉刷新
    onPullDownRefresh: function(){
        this.getCashgiftList(this.data.selectTypes);
         wx.stopPullDownRefresh()  
    },

    /**
        网络请求方法，参数为index
    */
    getCashgiftList : function(e){
        var data = this.data;
        var that = this;
        var params = {};
        params.page = 1;
        params.per_page = data.per_page;
        params.status = e;
        API.APICashgiftList.getCashgiftList(params).then(d=>{
            if (d.data.cashgifts.length) {
                d.data.cashgifts.map(function(item) {
                    if (item.status == 0) {
                        that.setData({
                             showType :false,
                        })
                    } else {
                         that.setData({
                             showType :true,
                        })
                        if (item.status == 1) {
                            item.status = data.types[1].name;
                        } else {
                            item.status = data.types[2].name;
                        }
                    }
                    item.effective = common.formatTime(item.effective);
                    item.expires = common.formatTime(item.expires);
                })
                that.setData({
                    cashgifts: d.data.cashgifts,
                    show : false,
                    isMore : d.data.paged.more
                });
            } else {
                that.setData({
                    show : true
                }); 
            }  
        });
    },

    /**
        网络请求方法，参数为index
    */
    getCashgiftListMore : function(e){
        var data = this.data;
        var that = this;

        var params = {};
        params.page = parseInt(data.cashgifts.length / data.per_page )+ 1;
        params.per_page = data.per_page;
        params.status = e;
        API.APICashgiftList.getCashgiftList(params).then(d=>{
            if (d.data.cashgifts.length) {
                d.data.cashgifts.map(function(item) {
                    if (item.status == 0) {
                        that.setData({
                             showType :false,
                        })
                    } else {
                         that.setData({
                             showType :true,
                        })
                        if (item.status == 1) {
                            item.status = data.types[1].name;
                        } else {
                            item.status = data.types[2].name;
                        }
                    }
                    item.effective = common.formatTime(item.effective);
                    item.expires = common.formatTime(item.expires);
                })
                that.setData({
                    cashgifts: data.cashgifts.concat(d.data.cashgifts),
                    show : false,
                    isMore : d.data.paged.more
                });
            } else {
                that.setData({
                    show : true
                }); 
            }  
        });
    },

    onReachBottom: function () {
        var isMore = this.data.isMore;
        if (isMore == 1) {
            this.getCashgiftListMore(this.data.selectTypes);
        }
    
    },

    // 切换红包类型
    tapGiftType: function(e) {
        var data = this.data;
        var that = this;
        data.types.map(function(type, index) {
            type.active = false;
        })
        data.types[parseInt(e.currentTarget.id)].active = true;
        that.setData({
            selectTypes : e.currentTarget.id,
        })
        this.setData(data);
        this.getCashgiftList(data.selectTypes);
       
    },
});
