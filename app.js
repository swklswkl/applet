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
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
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
    var result =[];
    //将对象转化为数组
    for (var i in data) {//过滤
      if (data[i] == "" & data[i] !=0){
        continue;
      }else{
        var str = i + "=" + data[i]
        result.push(str);
      }
    }
    //将数字按数据字典排序并用"&"
     result = result.sort().join("&") +"helloYya";
     var mdkey = hash.MD5(result);//md5加密  
     data['mdkey'] = hash.MD5(result);
     return data;
  }
  
})
