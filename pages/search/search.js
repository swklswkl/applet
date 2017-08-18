// search.js
var app = getApp();
var myWebsite = app.globalData.myWebsite;//接口网址
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
    this.setData({
      keyword:options.keyword
    })
    //获取当前的地理位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var latlng = latitude + "," + longitude      
        var searchClinic = {
          lng: latitude,
          lat: longitude,
          count: 10,
          start: 0,
          keyword: options.keyword
        }
        console.log(searchClinic)
        //调用全局加密方法
        var searchClinic = app.mdkey(searchClinic);
        //附近的诊所
        wx.request({
          url: myWebsite + 'appNewCustomer/Index/searchClinic',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: searchClinic,
          success: function (res) {
            var list = res.data.data
            console.log(list)
            /*for (var i in list) {
              list[i]['distance'] = (list[i]['distance'] / 1000).toFixed(1) + "km"
            }
            that.setData({
              clinic: list
            })
            start++;*/

          }
        });

      }
    });
    
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