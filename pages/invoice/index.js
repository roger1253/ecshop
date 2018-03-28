var API = require('../../api/api.endpoint.js');
const app = getApp();
Page({
    data: {
        companyShow: false,
        titles: [{ name: '个人', id: '1' }, { name: '公司', id: '2' }],
        types : [{}],  

        content:[{}],
        show : false,       //是否展示发票类型
        defaultType:"",         //从上个页面带来的默认发票类型
        defaultContent : "",    //从上个页面带来的默认发票内容
        defaultTitle : "",      //从上个页面带来的默认发票标题
        selectType :{},     //选择的发票类型
        selectContent :{},   //选择的发票内容
        invoiceTitle : ""   //发票标题
    },

    onLoad: function(options) {
        var that = this;
        that.setData({
            defaultType : options.invoiceType,
            defaultContent : options.invoiceContent,
            defaultTitle : options.invoiceTitle
        })
        this.getInvoiceTypeList();
        this.getInvoiceContentList();
        this.initInvoiceTitle();
    },

        //下拉刷新
    onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
    },
    //获取发票类型列表
    getInvoiceTypeList: function(){
        var that= this;
        var data = this.data;
        API.APIInvoiceTypeList.getInvoiceTypeList().then(d=>{
            var newTypes = [];
            d.data.types.map(function(item) {
                if (item.name.length) {
                    newTypes.push(item);
                }
            });
            data.types = newTypes;
            if (data.types.length) {
                data.show = true;
                //循环数据 找出跟上个页面带来的 发票类型一样的item
                data.types.forEach(function(item,index){
                    if (item.name == data.defaultType) {
                        data.types[index].iconShow = true;
                        data.selectType = data.types[index];
                    }
                });
          
            } else {
                data.show = false;
                data.selectType = {};
            }
            that.setData(data);
        });
    },
    //获取发票内容
    getInvoiceContentList: function(){
        var that= this;
        var data = this.data;
        API.APIInvoiceContentList.getInvoiceContentList().then(d=>{
            data.content = d.data.contents;
            if (data.content.length) {
                // if (selectContent) {
                    data.content.forEach(function(item,index){
                        if (item.name == data.defaultContent) {
                            data.content[index].iconShow = true;
                            data.selectContent = data.content[index];
                        }
                    });
                // }
            } else {
                  data.selectContent = [];
            }
           
            that.setData(data);
        });
    },

    //初始化发票抬头
    initInvoiceTitle:function(){
        var that = this;
        var data = this.data;
        if (data.defaultTitle == "") {
              data.invoiceTitle = '请输入公司名称';
            
        } else {
         

             if (data.defaultTitle == '个人') {
                data.companyShow = false;
                data.titles[0].iconShow = true;
            } else {
                data.companyShow = true;
                data.titles[1].iconShow = true;
            }
            data.invoiceTitle = data.defaultTitle;

        }
        that.setData(data);
    },

    //点击保存
    saveTap: function(){
        var data = this.data;
        //判断发票抬头是否选择了公司
        if (data.invoiceTitle.length) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length-2];
            var newInvoiceTitle ="";
               if (data.invoiceTitle) {
                    newInvoiceTitle = data.invoiceTitle;
                } else{
                    newInvoiceTitle = '个人';
                };

            prevPage.setData({
                invoiceType : data.selectType,  
                invoiceContent : data.selectContent,
                invoiceTitle : newInvoiceTitle,
            
                noInvoice : false,   
            });
            wx.navigateBack({
                 delta: 1,
            })
        } else {
            wx.showToast({
                title: '请输入填写发票',
                icon: 'success',
                duration: 1000
            })  
        }
    },

    //选择不要发票
    cancelTap: function(){
        var data = this.data;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length-2];
        prevPage.setData({
            noInvoice : true, 
            invoiceType : {},  
            invoiceContent : {},
            invoiceTitle : "",   
        });
        wx.navigateBack({
             delta: 1,
        })
    },

    //发票标题切换选择
    titleTap: function(e) {
        var data = this.data;
        data.titles.map(function(item) {
            item.iconShow = false;
        });
        data.titles[parseInt(e.currentTarget.id)].iconShow = true;

        if(data.titles[parseInt(e.currentTarget.id)].id == '2'){
            data.companyShow = true;
            data.invoiceTitle= "";
        }else{
            data.companyShow = false;
            data.invoiceTitle = "个人";
        }

        this.setData(data);
    },
    //获取发票标题输入内容
    bindTitle: function(e){
        var data = this.data;
        if (data.companyShow) {
            data.invoiceTitle = e.detail.value
            this.setData(data);
        }
    },
    //发票类型选择
    typeTap: function(e) {
        var data = this.data;
        data.types.map(function(item) {
            item.iconShow = false;
        });
        data.types[parseInt(e.currentTarget.id)].iconShow = true;
        data.selectType = data.types[parseInt(e.currentTarget.id)];
        this.setData(data);
    },

    //发票明细选择
    detailTap: function(e) {
        var data = this.data;
        data.content.map(function(item) {
            item.iconShow = false;
        });
        data.content[parseInt(e.currentTarget.id)].iconShow = true;
        data.selectContent = data.content[parseInt(e.currentTarget.id)];
        this.setData(data);
    },
});
