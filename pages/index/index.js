//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    imgPath: 'https://www.eeboo.cn/uploads/',
    iconPath: 'http://www.yyaai.com/uploads/icons/',
  },
  
  tapName: function(event) {
    //console.log(event)
  },

  //事件处理函数
  bindViewTap: function() {
   
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
            count:'10',
            start:'1',            
          };
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
              var data = res.data.data
              that.setData({
                clinic:data.clinic,
                total:data.total
              })
              
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


  }
 
})
