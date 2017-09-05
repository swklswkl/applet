// myadvis.js
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
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取缓存信息
    var that = this
    var cacheUserinfo = wx.getStorageSync('userInfo')
          that.setData({
            cacheUserinfo: cacheUserinfo
          })
        that.myadvisList();  
  },
  //接口我的咨询
  myadvisList:function(){
    
    var that = this
    var quizlist = {
      customer_id: that.data.cacheUserinfo.customer_id,
      page: that.data.pageSize,
      start: that.data.page,
    }
    //调用全局加密方法
    var quizlist = app.mdkey(quizlist);
    wx.request({
      url: myWebsite + 'appNewCustomer/Personal/getadvisory',
      method: 'post',
      data: quizlist,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var list = res.data.data.list
          var contentlistTem = that.data.contentlist
          if (that.data.page == 0) {
            contentlistTem = [];

          }
          if (list.length < that.data.pageSize) {
            that.setData({
              advislist: contentlistTem.concat(list),
              hasMoreData: false,
              loading: true,
            })
          } else {
            that.setData({
              advislist: contentlistTem.concat(list),
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
      this.myadvisList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})