// pages/clinics/clinics.js
//获取应用实例
var app = getApp()
var myWebsite = app.globalData.myWebsite;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: true,
    selected1: false,
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var clinic = {
      clinic_id: options.clinic_id,
    }
    //调用全局加密方法
    var clinic = app.mdkey(clinic);
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/clinicDetails',
      data: clinic,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            clinic: res.data.data.clinic,
            doctor: res.data.data.doctor,
            photo: res.data.data.photo,
          })
        }
      }
    })
  },
  //跳转到预约界面
  appoint: function () {
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
  //点击医生
  tapdoctor: function (e) {
    var doctor_id = e.currentTarget.dataset.doctor_id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/doctors/doctors?doctor_id=' + doctor_id + '&name=' + name
    })
  },
  //跳转认证详情
  viewDetail:function(e){
    var clinic_id = e.currentTarget.dataset.clinic_id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/clinicdetail/clinicdetail?clinic_id=' + clinic_id +'&name='+name
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