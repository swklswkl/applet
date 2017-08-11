//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    imgPath: 'https://www.eeboo.cn/uploads/',
  },
  
  tapName: function(event) {
    console.log(event)
  },

  //事件处理函数
  bindViewTap: function() {
   
  },
  //加载页面
  onLoad: function () {
    var that = this;
    var myWebsite = 'https://www.eeboo.cn/';
    //调用应用实例的方法获取全局数
    app.getUserInfo(function (userInfo, Data) {
      //更新数据
      that.setData({
        userInfo: userInfo

      })
    }),
    //请求首页接口
    wx.request({
      url: myWebsite+'appNewCustomer/Index/index',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.statusCode==200){
          var Data = res.data.data;
          console.log(Data);
          that.setData({
            indexInfo:Data,
            autoplay: true,
            interval: 5000,
            duration: 1000, 
          })
        }
      }
    })     
  }
 
})
