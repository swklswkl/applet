//app.js
var hash = new require("./utils/md5.js");//引用MD5文件
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function(res) {
          wx.getUserInfo({
            withCredentials: false,
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
      
    }
  },

  globalData: {
    userInfo: null,
    myWebsite:'https://www.eeboo.cn/',

  },
  //接口加密
  mdkey:function(data) {
    var arr1 =[];
    var data1 = [];
    //将对象转化为数
    for (var i in data) {//过滤
      if(data[i] != "" || data[i] =='0'){
        var str = i + "=" + data[i]
        arr1.push(str);
        data1[i] = data[i];
      }
    }
    //将数字按数据字典排序并用"&"
     var mdkey = arr1.sort().join("&")+"helloYya"; 
     data1['mdkey'] = hash.MD5(mdkey);
     return data1;
  },
  //时间戳转换成时间
  timechange: function (number){
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  },
  //判断是否登录
  isLogin:function(){
    wx.showToast({
      title: '请先登录',
      success: function (res) {
        setTimeout(function () {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }, 1500)
      }
    })
  }
 
})
