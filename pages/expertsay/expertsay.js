// expertsay.js
var app = getApp()
var myWebsite = app.globalData.myWebsite;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 10,
    hasMoreData: true,
    contentlist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //热门推荐接口
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/experts',
      method: 'get',
      success: function (res) {
        if (res.statusCode == 200) {
          for(var i=0;i<res.data.data.length;i++){
            res.data.data[i].update_time = app.timechange(res.data.data[i].update_time)
          }
          that.setData({
            hot: res.data.data
          })
        }
      }
    })
    //调用最新发布接口
    that.articleList()
  },
  //最新发布接口
  articleList:function(){
    
    var that = this;
    var articlelist = {
      page: that.data.pageSize,
      start: that.data.page,
    }
    //调用全局加密方法
    var articlelist = app.mdkey(articlelist);
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/expert',
      method: 'post',
      data: articlelist,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var list = res.data.data.list
          //时间戳转换转换成时间
          for (var i = 0; i < list.length; i++) {
            list[i].update_time = app.timechange(list[i].update_time)
          }
          var contentlistTem = that.data.contentlist
          if (that.data.page == 0) {
            contentlistTem = [];
          }
          if (list.length < that.data.pageSize) {
            that.setData({
              newest: contentlistTem.concat(list),
              hasMoreData: false
            })
          } else {
            that.setData({
              newest: contentlistTem.concat(list),
              hasMoreData: true,
              page: that.data.page + 1,
              contentlist: contentlistTem.concat(list)
            })
          }
        }
      }
    })
  },
  //跳转到文章内容
  taparticle:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/expertarticle/expertarticle?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.articleList()
    } else {
      wx.showToast({
        title: '没有更多数据'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})