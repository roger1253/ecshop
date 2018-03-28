//index.js
//获取应用实例
var API = require('../../api/api.endpoint.js');
var app = getApp()
Page({
    data: {       
        inputFocus: false,
        inputValue: ""
    },

     onLoad: function() {
        this.getCategoryList();
    },  

    //下拉刷新
    onPullDownRefresh: function(){
         this.getCategoryList();
         wx.stopPullDownRefresh()  
    },

    getCategoryList:function(){
        var that = this;
        var params = {};
        params.page = 1;
        params.per_page = 100;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });        
        API.APICategory.getCategoryList(params).then(d=>{
            var data = that.data;
            data.categories = d.data.categories;
            data.categories[0].opened = true; 
            that.setData(data);  
            wx.hideToast();              
        });
    },


    tapMenuItem: function(e) {
        var data = this.data;
        data.categories.map(function(menu, index) {
            menu.opened = false;
        })
        var currCategory = data.categories[parseInt(e.currentTarget.id)];
        if(currCategory.categories.length == 0){
           var url = '../productList/index?cid='+currCategory.id;
           wx.navigateTo({
                url: url
            });
           return;
        };
        data.categories[parseInt(e.currentTarget.id)].opened = true;
        this.setData(data);
    },

    tapSubMenuItem:function(e){
            var subCategory ={};
            for (var i = 0; i < this.data.categories.length; i++) {
                if(this.data.categories[i].opened){
                    subCategory = this.data.categories[i].categories[parseInt(e.currentTarget.id)];
                    break;
                }
            }
            var url = '../productList/index?cid='+subCategory.id;
           wx.navigateTo({
            url: url
            });
    },
    //搜索
    bindInput: function(e) {
        this.setData({
            inputFocus: true,
            inputValue: e.detail.value
        });
    },
    bindBlur: function (e) {
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
    bindChange: function(e) {
        var url = "../searchResult/index?keyword=" + this.data.inputValue;
        wx.navigateTo({ url: url });
    },    
})
