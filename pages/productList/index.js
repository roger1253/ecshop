var API = require('../../api/api.endpoint.js');
var app = getApp();
Page({

    data: {        
        types: [
            { name: '综合', active: true }, { name: '销量' }, { name: '新品' }, { name: '最贵' }, { name: '最便宜' }
        ],
        loading: false,
        hasMore: true,
        allowLoadMore: true, 
        PER_PAGE : 4,
        sort_key : 0, // 默认
        sort_value : 2, // 降序
    },

    // 切换排序方式
    tapSortWay: function(e) {
        var data = this.data;

        data.types.map(function(type, index) {
            type.active = false;
        })

        var index = parseInt(e.currentTarget.id);

        data.types[index].active = true;
        this.setData(data);

        if ( index == 0 )
        {
            // 综合排序
            data.sort_key = 0; // 默认
            data.sort_value = 2; // 降序
        }
        else if ( index == 1 )
        {
            // 销量排序
            data.sort_key = 4; // 销量
            data.sort_value = 2; // 降序            
        }
        else if ( index == 2 )
        {
            // 新拼排序
            data.sort_key = 5; // 上架时间
            data.sort_value = 2; // 降序            
        }
        else if ( index == 3 )
        {
            // 最贵排序
            data.sort_key = 1; // 价格
            data.sort_value = 2; // 降序
        }
        else if ( index == 4 )
        {
            // 最便宜排序
            data.sort_key = 1; // 价格
            data.sort_value = 1; // 升序
        }

        this.reloadProductList(data);
    },

    onLoad: function(option){
        var data = this.data;
        data.categoryId = option.cid;
        data.loading = true;
        this.reloadProductList(data);
        this.setData(data);
    },

    reloadProductList: function (data) {

        var params = {};
        params.category = data.categoryId;
        params.page = 1;
        params.per_page = data.PER_PAGE;
        params.sort_key = data.sort_key;
        params.sort_value = data.sort_value;

        API.APIProduct.getProductList(params).then(d=>{            
            var that = this;
             var data = this.data;
             data.products = d.data.products;
             data.loading = false;
             data.hasMore = d.data.paged.more;
             that.setData(data);
        });  
    },

     handleLoadMore: function(e) {
        if (!this.data.hasMore) return

        var data = this.data;

        if ( data.allowLoadMore )
        {
          data.allowLoadMore = false;
        }
        else
        {
          return;
        }

        data.loading = true;  

        var params = {};
        params.category = data.categoryId;
        params.page = data.products.length / data.PER_PAGE + 1;
        params.per_page = data.PER_PAGE;
        data.loading = true;
        this.setData(data);

      // 加载结束后  才能继续加载
        API.APIProduct.getProductList(params).then(d=>{            
            var that = this;
            var data = this.data;
            data.products = data.products ? data.products.concat(d.data.products) : d.data.products;             
            data.loading = false;
            data.hasMore = d.data.paged.more;
            that.setData(data);
            data.allowLoadMore = true;
        })
          .catch(e => {
            data.loading = false;
            this.setData(data); 
            console.error(e)
            data.allowLoadMore = true;
          })
    },

     tapProduct: function(e) {
            var data = this.data;
            var product = this.data.products[parseInt(e.currentTarget.id)];
            var url = '../productDetail/index?pid='+product.id;
            wx.navigateTo({
                url: url
            });
    },
    //数据提交事件
    // bindSubmit: function(e) {
    //     console.log('form发生了submit事件，携带数据为：', e.detail.value);
    //     wx.navigateTo({ url: "../productList/index.wxml" });
    // }
})
