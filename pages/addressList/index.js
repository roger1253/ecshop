//获取应用实例

var common = require('../../utils/util.js');
var API = require('../../api/api.endpoint.js');

Page({
    data: {
        items: [
        ],

        //地址是否为空
        show: false,

        //二次确认隐藏
        modalHidden: true,

        //要删除的地址
        deleteItem: '',

        // 修改
        isEdit: false
    },

    //下拉刷新
    onPullDownRefresh: function(){
        this.reloadModel();
         wx.stopPullDownRefresh()  
    },

    //加载页面时给每个选中添加状态
    onLoad: function(params) {
        this.data.consigneeId = params.consigneeId;
        this.data.isProfile = params.isProfile;
    },

    //当页面可见时就执行
    onShow: function(){
        this.reloadModel();
    },

    // 设置默认数据
    reloadModel: function () {
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });        
        //调用应用实例的方法获取全局数据
        API.APIConsignee.getConsigneeList().then(d => {
            wx.hideToast();
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

                // 判断当前选中的是谁，如果从确定订单进来的话
                d.data.consignees.forEach(function(item,index){
                    if ( item.id == that.data.consigneeId ) {
                        item.iconShow = true;
                    }
                });

                //更新数据
                this.setData({
                    items: d.data.consignees
                });
            }
            else
            {
                //更新数据
                this.setData({
                    show: true
                });
            }
        })
    },

    //切换选择
    selectTap: function(e){
         if ( this.data.isProfile )
        {

        } 
        else 
        {
            if ( !this.data.isEdit )
            {
                var data = this.data;
                data.items.map(function(item){
                    item.iconShow = false;
                });

                data.items[parseInt(e.currentTarget.id)].iconShow = true;

                this.setData(data);

                var pages = getCurrentPages();
                var prevPage = pages[pages.length-2];
                prevPage.setData({
                    defaultAddress : data.items[parseInt(e.currentTarget.id)],        
                })

                wx.navigateBack({
                    url: '../confirmOrder/index',
                })
            }

            this.data.isEdit = false;
        }        
    },

    // 编辑地址
    editTap: function(e) {
        this.data.isEdit = true;
        var item = this.data.items[parseInt(e.currentTarget.id)];
        item.isEdit = true;
        wx.navigateTo({
          url: '../editAddress/index?item=' + JSON.stringify(item)
        })
    },

    //删除二次确认
    modalTap: function(e) {
        this.data.isEdit = true;
        var deleteItem = this.data.items[parseInt(e.currentTarget.id)];
        this.setData({
            modalHidden: false,
            deleteItem: deleteItem
        })
    },

    //确认删除
    confirm: function() {
        var data = this.data;
        var index = common.indexOf(data.items, data.deleteItem);
        var consignee = data.items[index];

        var params = {};
        params.consignee = consignee.id;

        //调用应用实例的方法获取全局数据
        API.APIConsignee.removeConsignee(params).then(d => {            
            data.modalHidden = 'true';
            data.items.splice(index, 1);
            this.setData(data);

            //判断是否删除完了
            if (data.items.length == 0) {
                this.setData({
                    show: true,
                })
            }
        })
    },
    //取消
    cancel: function() {
        this.setData({
            modalHidden: true
        })
    }
})
