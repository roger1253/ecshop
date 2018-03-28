var API = require('../../api/api.endpoint.js');
//获取应用实例
var app = getApp()
Page( {
  data: {
    userInfo: {},
    nicknameInput : "",
  },
  //事件处理函数，保存
  saveNickName: function() {
    var that = this;
    var data = this.data;
    if (data.nicknameInput) {
      var params = {};
      params.nickname = data.nicknameInput;
      API.APIProfileUpdate.profileUpdate(params).then(d=>{
        that.setData({
          userInfo : d.data.user,
        });
        var pages = getCurrentPages();
        var prevPage = pages[pages.length-2];
        prevPage.setData({
            showName : d.data.user.nickname,        
        });
        wx.navigateBack( {
          url: '../myInfo/index'
        })
      });
    }
   
  },
     //下拉刷新
  onPullDownRefresh: function(){
       wx.stopPullDownRefresh()  
  },
  onLoad: function() {
    var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo( function( userInfo ) {
    //   //更新数据
    //   that.setData( {
    //     userInfo: userInfo
    //   });
    //   console.log(userInfo);
    // })
  },

  //获取输入的昵称
  nicknameInput: function(e){
    this.setData({
      nicknameInput : e.detail.value,
    });
  }
})
