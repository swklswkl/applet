// nousarticle.js
//获取应用实例
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
    var article = {
      article_id: options.article_id,
    }
    //调用全局加密方法
    var article = app.mdkey(article);
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/contents',
      data: article,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.data)
        res.data.data[0].create_time = app.timechange(res.data.data[0].create_time)
        if (res.statusCode == 200) {
          that.setData({
            data: res.data.data[0]
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