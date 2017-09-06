// icon.js
//获取应用实例
var app = getApp()
var myWebsite = app.globalData.myWebsite;//接口网址
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
  //点击医生
  tapdoctor: function (e) {
    var doctor_id = e.currentTarget.dataset.doctor_id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/doctors/doctors?doctor_id=' + doctor_id + '&name=' + name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      title:options.title
    })
    var tenicon = {
      tag_id: options.id,
      page: that.data.pageSize,
      start: that.data.page
    }
    //调用全局加密方法
    var tenicon = app.mdkey(tenicon);
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/iconDoctor',
      data: tenicon,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function(res) {
        if (res.statusCode == 200) {
          var list = res.data.data.list
          var contentlistTem = that.data.contentlist
          if (that.data.page == 0) {
            contentlistTem = [];
          }
          if (list.length < that.data.pageSize) {
            that.setData({
              doctor: contentlistTem.concat(list),
              hasMoreData: false
            })
          } else {
            that.setData({
              doctor: contentlistTem.concat(list),
              hasMoreData: true,
              page: that.data.page + 1,
              hiddenLoading: true,
              contentlist: contentlistTem.concat(list)
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})