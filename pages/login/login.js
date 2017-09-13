// login.js
var app = getApp()
var myWebsite = app.globalData.myWebsite;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  ischeck:false,
  },
//点击记住密码
  isrember:function(){
    var that = this;
    if (that.data.ischeck){
      that.setData({
        ischeck:false
      })
    }else{
      that.setData({
        ischeck: true
      })
    }
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
    //获取缓存的用户名密码
    try {
      var value = wx.getStorageSync('loginUserInfo')
      if (value) {
        // Do something with return value
        that.setData({
          loginMobile: value.mobile,
          loginPassword: value.password
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  //登录接口
  formsubmit: function (e) {
    var that = this;
    var getData = e.detail.value
    var Data = app.mdkey(getData);   
    wx.request({
      url: myWebsite + 'appNewCustomer/Customer/loginAction',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: Data,
      method: 'post',
      success: function (res) {      
        //登录成功
        if (res.data.code == '0') {
          //设置用户信息缓存数据          
            wx.setStorageSync('userInfo', {
              customer_id: res.data.data.customer_id,
              mobile: res.data.data.mobile,
              photo: that.data.userInfo.avatarUrl,
              nickName: that.data.userInfo.nickName,
              hx_service_id: res.data.data.hx_service_id
            })
          //设置记住密码缓存用户名密码
          if(that.data.ischeck==false){
            wx.setStorageSync("loginUserInfo", getData)
          }
          //跳转到上一个界面
          wx.showToast({
            title: res.data.msg,
            success: function (res) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        } else {
          console.log(res);
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