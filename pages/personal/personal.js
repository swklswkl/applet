// personal.js
var app = getApp();
var myWebsite = app.globalData.myWebsite;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数
    app.getUserInfo(function (userInfo, Data) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
   
  },
  //点击修改密码
  tapchangepwd:function(){
    var that = this
    if (!that.data.cacheUserinfo){
      app.isLogin()
    }else{
      wx.navigateTo({
        url: '/pages/changepassword/changepassword'
      })
    }
  },
  //点击我的咨询
  tapmyadvis: function () {
    var that = this
    if (!that.data.cacheUserinfo) {
      app.isLogin()
    } else {
      wx.navigateTo({
        url: '/pages/myadvis/myadvis'
      })
    }
  },
  //点击我的预约
  tapappint: function () {
    var that = this
    if (!that.data.cacheUserinfo) {
      app.isLogin()
    } else {
      wx.navigateTo({
        url: '/pages/myappoints/myappoints'
      })
    }
  },
  //点击意见反馈
  tapfeedback: function () {
    var that = this
    if (!that.data.cacheUserinfo) {
      app.isLogin()
    } else {
      wx.navigateTo({
        url: '/pages/feedback/feedback'
      })
    }
  },
  //退出登录
  exitLogin:function(){
    try {
      wx.removeStorage({
        key: 'userInfo',
        success: function(res) {
          console.log(res)
          wx.showToast({
            title: "已退出医牙啊",
            success: function (res) {
              setTimeout(function () {
                wx.reLaunch({
                  url: '/pages/index/index'
                })
              }, 1500)
            }
          })
        }
      })
     
    } catch (e) {
      console.log('服务错误')
      // Do something when catch error
    }
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
    //获取缓存信息
    var that = this
       wx.getStorage({
        key: 'userInfo',
        success: function(res) {
          if (res.data) {
            // Do something with return value
            that.setData({
              cacheUserinfo: res.data
            })
          }
        }
      })
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