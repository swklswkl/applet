// feedback.js
var app = getApp()
var myWebsite = app.globalData.myWebsite;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //注册
  bindFormSubmit: function (e) {
    var that = this;
    var Data = e.detail.value
    Data = app.mdkey(Data);
    wx.request({
      url: myWebsite + 'appNewCustomer/Personal/feedback',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: Data,
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: res.data.msg,
            success: function (res) {
              setTimeout(function () {
                wx.navigateBack({
                  //url: '/pages/personal/personal',
                })
              }, 1500)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            image: '/image/icon/failure.png',
          })
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