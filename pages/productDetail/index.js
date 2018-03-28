var API = require('../../api/api.endpoint.js');
var WxParse = require('../../libs/wxParse/wxParse.js');
const ENUM = require('../../utils/enum.js');
var app = getApp();

Page({
  data: {
    // 轮播相关配置
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 200,
    cartAmount: getApp().cartTotal(),

    //tab配置
    tabs: [{ name: "商品介绍", active: true }, { name: "规格参数", active: false }],

    //商品数量
    productAmount: 1,
    isPromos: false,
    promos: ''
  },
  onShareAppMessage: function () {
    return {
      title: this.data.product.name,
      path: 'pages/productDetail/index?pid=' + this.data.product.id
    }
  },

  //选中第一个属性
  onLoad: function (option) {

    var data = this.data;
    data.productId = option.pid;
    data.loading = true;
    this.setData(data);

  },

  //下拉刷新
  onPullDownRefresh: function () {
    var data = this.data;
    if (getApp().globalData.cartData) {
      data.cartAmount = getApp().globalData.cartData.cartTotal;
    }
    this.reloadProduct();
    this.loadCart();

    this.setData(data);
    wx.stopPullDownRefresh()
  },

  onShow: function () {
    //商品页面可见时，获取商品数据和购物车数据
    var data = this.data;
    if (getApp().globalData.cartData) {
      data.cartAmount = getApp().globalData.cartData.cartTotal;
    }
    this.reloadProduct();
    this.loadCart();

    this.setData(data);
  },

  reloadProduct: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    var params = {};
    params.product = this.data.productId;

    API.APIProduct.getProduct(params).then(d => {
      console.warn(d)
      var that = this;
      var data = this.data;
      data.product = this.setupProductData(d.data.product);
      console.warn('target', data.product)
      const source = data.product.photos.map(({ large }) => `<p><img src="${large}"/></p>`).join('')
      WxParse.wxParse('goods_desc', 'html', source, that, 5);
      data.product.properties.map(function (item) {
        // 不对多选判断
        if (!item.is_multiselect) {
          item.attrs.map(function (property) {
            var properties = [property.id];

            if (that.propertyExistence(properties)) {
              property.noClick = false;
            }
            else {
              property.noClick = true;
            }
          })
        }
      });

      data.loading = false;
      that.setData(data);

      wx.hideToast();
    });
  },

  // 设置商品数据
  setupProductData: function (product) {

    var promoStr = '';
    if (product.promos.length) {
      this.isPromos = true;

      for (var promoIndex in product.promos) {
        var promo = product.promos[promoIndex];

        if (promo.promo && promo.promo.length) {
          promoStr = promoStr + '，' + promo.promo;
        }
      }

      if (promoStr && promoStr.length) {
        promoStr = ' ' + promoStr.substring(1, promoStr.length - 1) + ' ';
      }
    }
    else {
      this.isPromos = false;
    }

    this.setData({
      promos: promoStr,
      isPromos: this.isPromos
    })

    return product;
  },

  //切换属性
  propertyTap: function (e) {
    var that = this;
    var data = this.data;
    var name = e.currentTarget.dataset.obj;
    var selectedItem;

    data.product.properties.map(function (_item) {
      if (name === _item.name) {
        selectedItem = _item;
      }
    })

    var currentProperty = selectedItem.attrs[parseInt(e.currentTarget.id)];

    // 只把单选框的置空
    if (!selectedItem.is_multiselect) {
      selectedItem.attrs.map(function (property) {

        // 忽略不可点击的
        if (currentProperty.noClick) {
          return;
        }

        // 把除了选中的子属性以外的其它属性都设置为未选中
        if (!(currentProperty.id == property.id)) {
          property.selected = false;
        }
      })
    }

    // 如果当前属性已经选择，那么当再次点击的时候，就取消选择
    currentProperty.selected = !currentProperty.selected;

    data.product.properties.map(function (_item) {
      // 排除多选框
      if (!_item.is_multiselect) {
        // 排除已经选择的
        var isSelected = false

        for (var attrIndex in _item.attrs) {
          var property = _item.attrs[attrIndex];

          // 用当前选中的属性和别的属性进行组合，然后去库存中对比，不符合的，设置为不可点击
          var selectedProperties = that.currentSelectedProperties()

          for (var propertySelectedIndex in selectedProperties) {
            if (selectedProperties[propertySelectedIndex] == property.id) {
              isSelected = true;
            }
          }
        }

        if (!isSelected) {
          for (var attrIndex in _item.attrs) {
            var property = _item.attrs[attrIndex];

            // 用当前选中的属性和别的属性进行组合，然后去库存中对比，不符合的，设置为不可点击
            var selectedProperties = that.currentSelectedProperties()

            selectedProperties.push(property.id);
            // 把当前出了选中的属性的父属性以外  进行组合
            if (that.propertyExistence(selectedProperties)) {
              property.noClick = false;
            }
            else {
              property.noClick = true;
            }
          }
        }
      }
    })

    this.setData(data);
  },
  //swiperChang handle
  swiperchange: function (e) {
    //FIXME: 当前页码
    //console.log(e.detail.current)
  },

  //tab切换
  tapTab: function (e) {
    var data = this.data;
    data.tabs.map(function (tab, index) {
      tab.active = false;
    })
    data.tabs[parseInt(e.currentTarget.id)].active = true;
    this.setData(data);
  },

  //添加数量
  tapAdd: function (e) {
    var nowAmount = this.data.productAmount;
    nowAmount++;

    var amount = this.currentProductAmount();

    if (amount != null) {
      if (amount >= nowAmount) {
        this.setData({
          productAmount: nowAmount
        });
      }
      else {
        this.setData({
          productAmount: amount
        });

        wx.showToast({
          title: '库存不足',
        });
      }
    } else {
      wx.showToast({
        title: '请选择商品属性',
      });
    }


  },
  //减少数量
  tapSub: function (e) {
    var nowAmount = this.data.productAmount;

    if (nowAmount > 1) {
      this.setData({
        productAmount: --nowAmount
      });
    }
  },

  //填写数量
  bindInput: function (e) {

    var amount = this.currentProductAmount();
    if (amount != null) {
      if (amount >= e.detail.value) {
        this.setData({
          productAmount: e.detail.value
        });

      }
      else {
        this.setData({
          productAmount: amount ? amount : 1
        });
        wx.showToast({
          title: '库存不足',
        });
      }
    } else {
      this.setData({
        productAmount: amount ? amount : 1
      });
      wx.showToast({
        title: '请选择商品属性',
      });
    }

  },

  // 获取当前选择的属性
  currentSelectedProperties: function () {
    // 获取当前选中属性的库存，只获取单选框的，多选框忽略
    var propertySelected = [];
    this.data.product.properties.map(function (_item) {
      if (!_item.is_multiselect) {
        // 不为多选框
        _item.attrs.map(function (property) {
          if (property.selected) {
            propertySelected.push(property.id);
          }
        })
      }
    })

    return propertySelected;
  },

  // 获取当前库存
  currentProductAmount: function () {
    // 如果没有属性，只有数量，那么就获取商品总库存，否则获取当前所选择属性的库存

    if (this.data.product.properties.length) {
      var item = this.currentSelectedPropertie();
      if (item) {
        return item.stock_number;
      } else {
        return null;
      }
    }
    else {
      return this.data.product.good_stock;
    }
  },

  // 获取当前选择的属性库存对象
  currentSelectedPropertie: function () {
    var propertySelected = this.currentSelectedProperties();

    // 判断选中子属性的数组是否在库存数组中，在的话取出对应属性库存对象
    var currentSelectedItem;

    for (var stockIndex in this.data.product.stock) {
      var item = this.data.product.stock[stockIndex];

      var propertySelectedStr = propertySelected.sort().toString();

      var itemPropertyStr = item.goods_attr.split("|").sort().toString();

      if (propertySelectedStr == itemPropertyStr) {
        return item;
      }
    }

    return currentSelectedItem;
  },

  // 根据的到的属性id数组，来判断是否存在与库存组合中
  propertyExistence: function (propertys) {

    var that = this;
    var isExistence = false;

    that.data.product.stock.map(function (_item) {
      var goodsAttrs = _item.goods_attr.split("|");
      // 判断propertys中元素是否存在与库存中
      if (that.isSubset(goodsAttrs, propertys)) {
        isExistence = true;
      }
    })

    return isExistence;
  },

  //如果arr2是arr1的子集，则返回1
  isSubset: function (arr1, arr2) {
    var numCount = 0;

    for (var arr2Index in arr2) {
      for (var arr1Index in arr1) {
        if (arr1[arr1Index] == arr2[arr2Index]) {
          numCount++;
        }
      }
    }

    if (numCount >= arr2.length && numCount > 0)
      return 1;
    else
      return 0;
  },

  tapAddCart: function (e) {
    var that = this;
    if (app.isLogin()) {

      var amount = this.currentProductAmount();
      if (amount != null) {
        if (0 >= amount) {
          wx.showToast({
            title: '库存不足'
          });

          return;
        }

        // 判断当前组合是否存在
        if (that.data.product.properties && that.data.product.properties.length) {
          if (!that.propertyExistence(that.currentSelectedProperties())) {
            wx.showToast({
              title: '当前组合不存在'
            });

            return;
          }
        }

        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 30000
        });

        var params = {};
        params.product = this.data.productId;
        params.amount = this.data.productAmount;
        var propertySelected = [];

        this.data.product.properties.map(function (_item) {
          _item.attrs.map(function (property) {
            if (property.selected) {
              propertySelected.push(property.id);
            }
          })
        })

        params.property = JSON.stringify(propertySelected);
        API.APICart._add(params).then(d => {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 3000
          });
          that.loadCart();
        });

      } else {
        wx.showToast({
          title: '请选择商品属性',
        });
      }
    } else {
      app.login();
    }


  },
  loadCart: function () {
    var that = this;
    var data = this.data;
    API.APICart._get().then(d => {
      getApp().globalData.cartData = d.data.goods_groups[0];

      if (getApp()) {
        data.cartAmount = getApp().cartTotal();
      }

      that.setData(data);
    });
  },
  tapBuyNow: function (e) {
    var that = this;
    if (app.isLogin()) {
      var amount = this.currentProductAmount();
      if (amount != null) {
        if (0 >= amount) {
          wx.showToast({
            title: '库存不足'
          });

          return;
        }

        // 判断当前组合是否存在
        if (that.data.product.properties && that.data.product.properties.length) {
          if (!that.propertyExistence(that.currentSelectedProperties())) {
            wx.showToast({
              title: '当前组合不存在'
            });

            return;
          }
        }

        getApp().globalData.confirmProductData.product = this.data.product;

        var propertySelected = [];
        this.data.product.properties.map(function (_item) {
          _item.attrs.map(function (property) {
            if (property.selected) {
              propertySelected.push(property.id);
            }

          })
        });
        getApp().globalData.confirmProductData.attrs = propertySelected;
        getApp().globalData.confirmProductData.amount = this.data.productAmount;

        var url = '../confirmOrder/index?type=' + ENUM.CONFIRM_PRODUCT;
        wx.navigateTo({
          url: url
        });
      } else {
        wx.showToast({
          title: '请选择商品属性',
        });
      }


    }
    else {
      app.login();
    }
  },
  touchCart: function (e) {
    if (app.isLogin()) {
      var url = '../cart/index';
      wx.switchTab({
        url: url
      })

    }
    else {
      app.login();
    }
  }
})
