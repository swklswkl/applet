// quiz.js
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
    loading:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    //导航栏接口
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/tag_icon',
      method: 'get',
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            tag_icon: res.data.data
          })
        }
      }
    })
    //调用问答list接口
    that.articleList()
  },
  //问答list接口
  articleList: function (tag_id=1) {
    var that = this;
    var quizlist = {
      tag_id: tag_id,
      page: that.data.pageSize,
      start: that.data.page,
    }
    //调用全局加密方法
    var quizlist = app.mdkey(quizlist);
    console.log(quizlist)
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/quiz',
      method: 'post',
      data: quizlist,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var list = res.data.data.list
          var contentlistTem = that.data.contentlist
          if (that.data.page == 0) {
            contentlistTem = [];
          }
          if (list.length < that.data.pageSize) {
            that.setData({
              count: res.data.data.count,
              quizlist: contentlistTem.concat(list),
              hasMoreData: false,
              loading:true,
            })
          } else {
            that.setData({
              count: res.data.data.count,
              quizlist: contentlistTem.concat(list),
              hasMoreData: true,
              page: that.data.page + 1,
              contentlist: contentlistTem.concat(list),
              loading: true,
            })
          }
        }
      }
    })
  },
  //问答类型更换
  taparticle: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    that.articleList(id)
  },
  tapquizlist:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/quizarticle/quizarticle?id=' + id
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
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})