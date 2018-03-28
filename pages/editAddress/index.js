var API = require('../../api/api.endpoint.js');

Page({
    data: {
        imageName : 'circle',
        regions: [],
        provinceRegions : [],
        cityRegions : [],
        districtRegions : [],
        provinceIndex: 0,
        cityIndex: 0,
        districtIndex: 0,
        provinRegionName:'',
        cityRegionName:'',
        districtRegionName:'',
        isModify:false,
        currentDistrictRegionConsignee: {

        },
        consignee:{
            
        }
    },

    onLoad: function(param) {
        var that = this;
        that.loadRegionsCache(param);
    },

        //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },

    // 获取收货地址
    loadRegionsCache: function (param) {
        var that = this;
        wx.getStorage({
            key: 'regions',
            success: function(res) {

                if ( typeof(res.data) == "string" )
                {
                    that.regions = JSON.parse(res.data);
                }
                else
                {
                    that.regions = res.data;
                }

                if (that.regions.length == 0) {
                    that.reloadRegionsModel();
                } else {
                    that.reloadRegionListData();
                }

                that.reloadViewData(param);
            },
            fail: function(){
                that.reloadRegionsModel();

                that.reloadViewData(param);
            }
        })
    },

    // 设置默认数据
    reloadViewData: function (param) {
        var that = this;

        if ( param.item )
        {
            that.data.isModify = true;
            param.item = JSON.parse(param.item)

            wx.setNavigationBarTitle({
              title: '编辑收货地址',
            })

            // 如果为修改，那么就初始化默认数据
            var provinRegionIndex = 0;
            var cityRegionIndex = 1;
            var districtRegionIndex = 2;

            if ( param.item.regions.length > 3 )
            {
                provinRegionIndex = 1;
                cityRegionIndex = 2;
                districtRegionIndex = 3;
            }

            // 默认地址
            var defaultAddressImageName = 'circle';
            if ( param.item.is_default )
            {
                defaultAddressImageName = 'success';
            }

            if(that.regions.length != 0){
                var currentCountryConsignee = that.regions[0];
                var currentProvinceRegions = currentCountryConsignee.regions;

                var  defaultprovinRegionName =  param.item.regions[provinRegionIndex].name;
                currentProvinceRegions.forEach(function(item,index){
                    if (item.name == defaultprovinRegionName) {
                        that.data.provinceIndex = index;
//                        that.setData(that.data);
                    }
                });

                var currentProvinceConsignee = currentProvinceRegions[that.data.provinceIndex];
                var currentCityRegions = currentProvinceConsignee.regions;

                var defaultcityName = param.item.regions[cityRegionIndex].name;
                currentCityRegions.forEach(function(item,index){
                    if (item.name == defaultcityName) {
                        that.data.cityIndex = index;
//                        that.setData(that.data);
                    }
                });

                var currentCityRegionConsignee = currentCityRegions[that.data.cityIndex];
                var currentDistrictRegions = currentCityRegionConsignee.regions;

                var defaultdistrictName = param.item.regions[districtRegionIndex].name;
                currentDistrictRegions.forEach(function(item,index){
                    if (item.name == defaultdistrictName) {
                        that.data.districtIndex = index;
//                       that.setData(that.data);
                    }
                });

                that.setData({
                    consignee:param.item,
                    currentDistrictRegionConsignee : param.item,
                    provinRegionName : param.item.regions[provinRegionIndex].name,
                    cityRegionName : param.item.regions[cityRegionIndex].name,
                    districtRegionName : param.item.regions[districtRegionIndex].name,
                    imageName: defaultAddressImageName,
                    isModify: true,
                })

                that.reloadRegionListData();
            }  
        }
        else
        {
            that.data.isModify = false;
            that.setData({
                isModify: false,
            })
            // 添加地址
            wx.setNavigationBarTitle({
              title: '添加收货地址',
            })
        }
    },

    // 获取区域
    reloadRegionsModel:function(){
        var that = this;
        //调用应用实例的方法获取全局数据
        API.APIRegion.getRegionList().then(d=> {
            // 判断当前数组的长度，如果为空那么就显示地址为空
            if ( d.data.regions.length ) {
                that.regions = d.data.regions;
                wx.setStorage({
                  key:"regions",
                  data:d.data.regions
                })
                that.reloadRegionListData();
            }
            else
            {
                //更新数据
                that.setData({
                });
            }
        })
    },

    // 区域数据初始化
    reloadRegionListData: function() {
        var that = this;
        var regionStr = JSON.stringify(that.regions);
        var regions = JSON.parse(regionStr);
        if(regions.length != 0){
            var currentCountryConsignee = regions[0];
            var currentProvinceRegions = currentCountryConsignee.regions;

            var currentProvinceConsignee = currentProvinceRegions[that.data.provinceIndex];
            var currentCityRegions = currentProvinceConsignee.regions;

            var currentCityRegionConsignee = currentCityRegions[that.data.cityIndex];
            var currentDistrictRegions = currentCityRegionConsignee.regions;

            //更新数据
            currentProvinceRegions.forEach(function(item,index){
                item.regions = null;
            });

            that.data.provinceRegions = currentProvinceRegions;
            that.setData(that.data);

            var newcurrentCityRegions = [];
            currentCityRegions.forEach(function(item,index){
                item.regions = null;
            });

            that.data.cityRegions = currentCityRegions;
            that.setData(that.data);

            var newcurrentDistrictRegions = [];
            currentDistrictRegions.forEach(function(item,index){
                item.regions = null;
            });

            that.data.districtRegions = currentDistrictRegions;
            that.setData(that.data);
        }
    },

    // 更改view上选中的区域数据
    reloadRegionData: function() {
        var that = this;
        if (that.regions.length != 0) {
            var currentCountryConsignee = that.regions[0];
            var currentProvinceRegions = currentCountryConsignee.regions;

            var currentProvinceConsignee = currentProvinceRegions[that.data.provinceIndex];
            var currentCityRegions = currentProvinceConsignee.regions;

            var currentCityRegionConsignee = currentCityRegions[that.data.cityIndex];
            var currentDistrictRegions = currentCityRegionConsignee.regions;

            var defaultcityName = currentCityRegionConsignee.name;
            that.data.currentDistrictRegionConsignee = currentDistrictRegions[that.data.districtIndex];

            //更新数据
            that.setData({
                // 省份数据
                provinRegionName: currentProvinceConsignee.name,

                // 城市数据
                cityRegionName: currentCityRegionConsignee.name,

                // 区域数据
                districtRegionName: that.data.currentDistrictRegionConsignee.name,

                // 更新当前区域
                currentDistrictRegionConsignee : that.data.currentDistrictRegionConsignee,
            });

        } else {
            
        }
    },

    //设置为默认地址
    defaultTap: function() {

        var params = {};
        params.consignee = this.data.consignee.id;

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });

        API.APIConsignee.defaultConsignee(params).then(d => {
            wx.hideToast();
            if (this.data.imageName == 'circle') {
                var currentConsignee = this.data.consignee;
                currentConsignee.is_default = true;
                this.setData({
                    imageName : 'success',
                    consignee: currentConsignee
                })
            } else {
                var currentConsignee = this.data.consignee;
                currentConsignee.is_default = false;
                this.setData({
                imageName : 'circle',
                consignee: currentConsignee
                })
            }

            wx.showToast("请求完成");
        })
    },

    // 名称变化
    bindNameInput: function(e) {
        this.data.consignee.name = e.detail.value;
    },

    // 手机号变化
    bindMobileInput: function(e) {
        this.data.consignee.mobile = e.detail.value;
    },
    
    // 详细地址变化
    bindAddressInput: function(e) {
        this.data.consignee.address = e.detail.value;
    },

    bindZipCodeInput: function(e) {
        this.data.consignee.zip_code = e.detail.value;
    },

    //picker值改变时
    provincePickerChange: function(e) {
        this.data.provinceIndex = e.detail.value;
        this.data.cityIndex = 0;
        this.data.districtIndex = 0;
        this.reloadRegionData();
        this.reloadRegionListData();
    },

    cityPickerChange: function(e) {
        var that = this;
        this.data.cityIndex = e.detail.value;
        this.data.districtIndex = 0;
        this.reloadRegionData();
        this.reloadRegionListData();
    },

    districtPickerChange: function(e) {
        this.data.districtIndex = e.detail.value;
        this.reloadRegionData();
        this.reloadRegionListData();
    },

    bindConsignee: function(e) {
        var params = {};
        var data = this.data;
        params.consignee = data.consignee.id;
        params.name = data.consignee.name;
        params.mobile = data.consignee.mobile;
        params.address = data.consignee.address;
        params.tel = data.consignee.tel;
        params.zip_code = data.consignee.zip_code;
        params.region = data.currentDistrictRegionConsignee.id;

        var tips = '';
        if ( params.name )
        {
            if ( !params.name.length )
            {
                wx.showToast({
                    title: '请填写收件人姓名'
                });
                return;
            }

            if ( params.name.length < 2 || params.name.length > 15 )
            {
                wx.showToast({
                    title: '请输入2-15个字符的联系人姓名'
                });
                return;
            }
        }
        else
        {
            wx.showToast({
                title: '请填写收件人姓名'
            });
            return;
        }

        if ( !(params.mobile && params.mobile.length) )
        {
            wx.showToast({
                title: '请填写手机号码'
            });
            return;
        }

        if ( !params.region )
        {
            wx.showToast({
                title: '请选择所在地区'
            });
            return;
        }

        if ( !(params.zip_code && params.zip_code.length) )
        {
            wx.showToast({
                title: '请填写邮编'
            });
            return;
        }

        if ( !(params.address && params.address.length) )
        {
            wx.showToast({
                title: '请填写详细地址'
            });
            return;
        }
        
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        });
        if ( this.data.isModify )
        {
            this.updateConsignee(params);
        }
        else
        {
            this.addConsignee(params);
        }

    },

    back: function(){
        wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
        })
    },

    // 修改收件人
    updateConsignee: function(params){
        API.APIConsignee.updateConsignee(params).then(d => {
            var data = this.data;
            this.setData(data);
            wx.hideToast();
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
        })
    },

    // 添加收件人
    addConsignee: function (params){
        API.APIConsignee.addConsignee(params).then(d => {
               var data = this.data;
            this.setData(data);
            wx.hideToast();
            wx.navigateBack({
              delta: 1, // 回退前 delta(默认为1) 页面
            })
        })
    },
})