// doctors.js
var app = getApp()
var myWebsite = app.globalData.myWebsite;//接口网址
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
    var that = this;
    var doctors = {
      doctor_id: options.doctor_id,
    }
    that.setData({
      name: options.name,
    })
    //调用全局加密方法
    var doctors = app.mdkey(doctors);
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/resume',
      data: doctors,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            photo: res.data.data.photo,
            aboutme: res.data.data.aboutMe
          })
        }
      }
    })
  },
  //跳转到预约界面
  appoint: function () {
    var that = this
    wx.switchTab({
      url: '/pages/appointment/appointment',
    })
  },
  //跳转到咨询界面
  adv: function () {
    wx.switchTab({
      url: '/pages/advisory/advisory',
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