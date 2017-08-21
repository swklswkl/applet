//index.js
//获取应用实例
var start = 0;//分页
var app = getApp()
Page({
  data: {
    userInfo: {},
    imgPath: 'https://www.eeboo.cn/uploads/',
    iconPath: 'http://www.yyaai.com/uploads/icons/',
  },
  //搜索输入完关键字触发跳转页面
  search: function (event) {
    var keyword = event.detail.value;
    wx.navigateTo({
      url: '/pages/search/search?keyword='+keyword,
    })
  },
  //加载页面
  onLoad: function () {
    var that = this;
    var myWebsite = app.globalData.myWebsite;
    //调用应用实例的方法获取全局数
    app.getUserInfo(function (userInfo, Data) {
      //更新数据
      that.setData({
        userInfo: userInfo

      })
    })
    //获取当前的地理位置
      wx.getLocation({
        type:'gcj02',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          var latlng = latitude + "," + longitude
          //调用第三方接口获取地理位置
          wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            data: {
              location: latlng,
              key:"J6JBZ-HYHK6-T2WSP-EXKXS-2JIA3-CSBIS"
            },
            success: function (res) {
              var address = res.data.result.address
              if(res.statusCode==200){
                that.setData({
                  address:address       
                })
              }
            }
          })
          
          var nearclinic = {
            lng:latitude,
            lat:longitude,
            count:20,
            start:start,            
          }
          //调用全局加密方法
          var Dataclinic = app.mdkey(nearclinic);
          //console.log(Dataclinic)
          //附近的诊所
          wx.request({
            url: myWebsite +'appNewCustomer/Index/nearClinic',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            data: Dataclinic,
            success: function (res) {
              var list = res.data.data.clinic
              for(var i in list){
                list[i]['distance'] = (list[i]['distance'] / 1000).toFixed(1)+"km"
              }
              that.setData({
                clinic:list
              })
              start ++;
               
            }
          });
          
        }
      });
      
      //请求首页接口
      wx.request({
        url: myWebsite+'appNewCustomer/Index/index',
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if(res.statusCode==200){
            var Data = res.data.data;
            //console.log(Data)
            that.setData({
              indexInfo:Data,
            
            })
          }
        }
      });


  },
  onReachBottom: function () {
    //上拉  
      start +=  1;
      //console.log(start)
  }  
 
})
