var API = require('../../api/api.endpoint.js');
var common = require('../../utils/util.js');
Page({
    data: {
      article:{"id" : 0},
      per_page : 10,
      articles: [{}],
      show : true,
    },

    onLoad:function(e){
      var that = this;
      var data = this.data;
      if (e.article) {
          data.article = e.article;
      };
      that.setData(data);
      that.getArticleList(data.article.id);
    },

    //通过ID获取文章列表
    getArticleList:function(e){
      var data = this.data;
      var params = {};
      var that = this;
      params.id = e;
      params.page = 1;
      params.per_page = data.per_page;
      API.APIArticleList.getArticleList(params).then(d=>{
        data.articles = d.data.articles;
        if (d.data.articles.length) {
          data.show = false;
        } else {
          data.show = true;
        }
        this.setData(data);
      });
    },

    //选择帮助列表item
    selectArticle:function(e){
      var that = this;
      var data = this.data;
      var selectArticle = data.articles[parseInt(e.currentTarget.id)];
      if (selectArticle.more) {
        var url = '../helpList/index?article='+selectArticle.id;
        wx.navigateTo({
          url: url
        });
      } else {
        
      }
    }
});
