var API = require('../../api/api.endpoint.js');
//获取应用实例
var app = getApp()
Page( {
  data: {
    // 用户性别
    "PROFILE_GENDER" :
    {
        "UNKNOWN"           : 0,    // 保密
        "MALE"              : 1,    // 男
        "FEMALE"            : 2     // 女
    },
    userInfo: {},
    avatarActionSheetHidden: true,
    avatarActionSheetItems: ['拍照', '从相册选择'],
    genderActionSheetHidden: true,
    genderActionSheetItems: ['男', '女'],
    genderTypes : ['保密','男', '女'],      //性别选项的几种状态
    showName : "",    //要展示的昵称名。如果账号没有昵称，就显示用户名，有昵称显示昵称名
  },

  onLoad: function() {
    var that = this;
    var data = this.data;
    //调用接口，获取用户资料
    API.APIProfileGet.getUserProfile().then(d=>{
      that.setData({
        userInfo : d.data.user,
      });
      that.initUserInfo();
    });

  } ,

      //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },
  /*
    根据用户资料，获取用户昵称和性别
  */
  initUserInfo:function(){
    var data = this.data;
    if (data.userInfo.nickname) {
        data.showName = data.userInfo.nickname;
    } else {
        data.showName = data.userInfo.username;
    }

    if (data.userInfo.gender == data.PROFILE_GENDER.UNKNOWN) {
        data.userInfo.gender = data.genderTypes[0];
    } else if (data.userInfo.gender == data.PROFILE_GENDER.MALE) {
        data.userInfo.gender = data.genderTypes[1];
    } else {
        data.userInfo.gender = data.genderTypes[2];
    }
    this.setData(data);
  },
  //选择性别后的操作
  selectGradle :function(e){
    var that = this;
    var data = this.data;
    var params = {};

    if (parseInt(e.currentTarget.id) == 0) {
        params.gender = data.PROFILE_GENDER.MALE;
    } else {
        params.gender = data.PROFILE_GENDER.FEMALE;
    }
    API.APIProfileUpdate.profileUpdate(params).then(d=>{
      that.setData({
        userInfo : d.data.user,
      });
      that.initUserInfo();
    });
  },

  //事件处理函数，展示选择头像
  avatarActionSheetTap: function() {
    this.setData({
        //取反
      avatarActionSheetHidden: !this.data.avatarActionSheetHidden
    });
  },
  //隐藏选择头像
  avatarActionSheetChange:function() {
    this.setData({
      avatarActionSheetHidden: !this.data.avatarActionSheetHidden
    })
  },
  //展示选择性别
  genderActionSheetTap: function() {
    this.setData({
        //取反
      genderActionSheetHidden: !this.data.genderActionSheetHidden
    });
  },

  //隐藏选择性别
  genderActionSheetChange:function(e) {
    this.setData({
      genderActionSheetHidden: !this.data.genderActionSheetHidden
    })
  },
})
