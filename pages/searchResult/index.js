var API = require('../../api/api.endpoint.js');
var app = getApp();
Page({
    data: {
        // 排序键
        "SORT_KEY" :
        {
            "DEFAULT"           : 0,        // 默认
            "PRICE"             : 1,        // 价格从低到高
            "POPULAR"           : 2,        // 人气
            "CREDIT"            : 3,        // 信用
            "SALE"              : 4,        // 销量
            "DATE"              : 5         // 上架时间
        },
        // 排序值
        "SORT_VALUE" :
        {
            "DEFAULT"       : 0,            // 默认排序
            "ASC"           : 1,            // 升序
            "DESC"          : 2             // 降序
        },
        // item
        products: [{}],
        types: [
            { name: '综合', active: true }, { name: '销量' }, { name: '新品' }, { name: '最贵' }, { name: '最便宜' }
        ],

        inputFocus: true,
        inputValue: "",
        active: true,
        sort_key : 0,       
        sort_value : 2,
        // keyword : "",       //搜索关键字
        per_page : 10,      //每次请求10个
        hasMore : false

    },
    // onReady: function() {
    //     wx.setNavigationBarTitle({
    //         title: "搜索结果"
    //     })
    // },

    onLoad: function(e){
        var data = this.data;
        var that = this;
        //获取上个页面带过来的关键词
        data.inputValue = e.keyword;
        this.setData(data);
        //获取默认商品排序
        that.getSearchList(); 
    },

    //获取搜索商品列表。
    getSearchList: function(){
        var that = this;
        var data = this.data;
        var params = {};
        params.keyword = data.inputValue;
        params.sort_key = data.sort_key;
        params.sort_value = data.sort_value;
        params.page = 1;
        params.per_page = data.per_page; 
         API.APISearchProductList.getSearchProductList(params).then(d=>{            
             data.products = d.data.products;
             // if (d.data.paged.more = 1) {
             //    data.hasMore = true;
             // } else {
             //    data.hasMore = false;
             // }
            data.hasMore = d.data.paged.more;
            that.setData(data);  
        }); 
             //console.log(e.detail.current)
    },

    //获取搜索商品列表。
    handleLoadMore: function(){
        if (!this.data.hasMore) return
        var that = this;
        var data = this.data;
        var params = {};
        params.keyword = data.inputValue;
        params.sort_key = data.sort_key;
        params.sort_value = data.sort_value;
        params.page = parseInt(data.products.length / data.per_page )+ 1;
        params.per_page = data.per_page; 
         API.APISearchProductList.getSearchProductList(params).then(d=>{  
          var oldProducts = data.products          
             data.products = oldProducts.concat(d.data.products);
             console.log('d.data.paged.more :' + d.data.paged.more);
             // if (d.data.paged.more) {
             //    data.hasMore = true;
             // } else {
             //    data.hasMore = false;
             // }
            data.hasMore = d.data.paged.more;
            that.setData(data);  
        }); 

    },

    //下拉刷新
    onPullDownRefresh: function(){
        this.getSearchList();
         wx.stopPullDownRefresh()  
    },

    //上拉加载更多
    onReachBottom: function () {
        if (this.data.hasMore) {
            this.getSearchListMore();
        }
    },


    // handleLoadMore: function(e) {
    //     if (!this.data.hasMore) return
    //     var data = this.data;
    //     data.loading = true;  

    //     var params = {};
    //     params.category = data.categoryId;
    //     params.page = data.products.length / data.PER_PAGE + 1;
    //     params.per_page = data.PER_PAGE;
    //     data.loading = true;
    //     this.setData(data);  
    //     API.APIProduct.getProductList(params).then(d=>{            
    //         var that = this;
    //         var data = this.data;
    //         data.products = data.products ? data.products.concat(d.data.products) : d.data.products;             
    //         data.loading = false;
    //         data.hasMore = d.data.paged.more;
    //         that.setData(data);  
    //     })        
    //       .catch(e => {
    //         data.loading = false;
    //         this.setData(data); 
    //         console.error(e)
    //       })
    // },


    bindInput: function(e) {
        this.setData({
            inputFocus: true,
            inputValue: e.detail.value
        });
    },
    bindBlur: function(e) {
        this.setData({
            inputFocus: false,
            inputValue: ""
        });
    },
    tapCancel: function(e) {
        this.setData({
            inputFocus: false,
            inputValue: ""
        });
    },
    // 切换排序方式
    tapSortWay: function(e) {
        var data = this.data;
        data.types.map(function(type, index) {
            type.active = false;
        })
        data.types[parseInt(e.currentTarget.id)].active = true;
        //根据选择的tab ，更改sort_key和sort_value
        switch (parseInt(e.currentTarget.id)) {
            case 0:
                data.sort_key = data.SORT_KEY.DEFAULT;
                data.sort_value = data.SORT_VALUE.DESC;
                break;
            case 1:
                data.sort_key = data.SORT_KEY.SALE;
                data.sort_value = data.SORT_VALUE.DESC;
                break;
            case 2:
                data.sort_key = data.SORT_KEY.DATE;
                data.sort_value = data.SORT_VALUE.DESC;
                break;
            case 3:
                data.sort_key = data.SORT_KEY.PRICE;
                data.sort_value = data.SORT_VALUE.DESC;
                break;
            case 4:
                data.sort_key = data.SORT_KEY.PRICE;
                data.sort_value = data.SORT_VALUE.ASC;
                break;
            default:
        }
        this.setData(data);
        this.getSearchList();
    },

    //点击回车时
     bindChange: function(e) {
     //当搜索关键词改变了。列表也要刷新，并且排序置为综合
        var data = this.data;
        data.sort_key = data.SORT_KEY.DEFAULT;
        data.sort_value = data.SORT_VALUE.DESC;
        data.types.map(function(type, index) {
            type.active = false;
        })
        data.types[0].active = true;
        this.setData(data);
        this.getSearchList();
    },
})
