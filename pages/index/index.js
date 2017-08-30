//index.js
//获取应用实例
var app = getApp()
var myWebsite = app.globalData.myWebsite;
Page({
  data: {
    userInfo: {},
    imgPath: 'https://www.eeboo.cn/uploads/',
    iconPath: 'http://www.yyaai.com/uploads/icons/',
    address: "",
    //分页数据
    page: 0,
    pageSize: 10,
    hasMoreData: false,
    contentlist: [],
    hiddenLoading: false,
  },
  //搜索输入完关键字触发跳转页面
  search: function (event) {
    var keyword = event.detail.value;
    wx.navigateTo({
      url: '/pages/search/search?keyword=' + keyword,
    })
  },
  map_address: function () {
    wx.chooseLocation({
      success: function (res) {
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,

        })
      }
    })
  },
  //10图标页面传值
  tenicon: function (e) {
    var id = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/icon/icon?id=' + id + '&title=' + title,
    })
  },
  //小常识文章
  scrollarticle: function (e) {
    var article_id = e.currentTarget.dataset.article_id
    wx.navigateTo({
      url: '/pages/nousarticle/nousarticle?article_id=' + article_id,
    })
  },
  //点击附近的诊所
  tapnearclinic: function (e) {
    var clinic_id = e.currentTarget.dataset.clinic_id
    wx.navigateTo({
      url: '/pages/clinics/clinics?clinic_id=' + clinic_id,
    })
  },
  expertsay: function () {
    wx.navigateTo({
      url: '/pages/expertsay/expertsay'
    })
  },
  publicquiz: function () {
    wx.navigateTo({
      url: '/pages/quiz/quiz'
    })
  },
  //获取当前的地理位置
  nearClinicList: function () {

    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var latlng = latitude + "," + longitude
        //调用第三方接口获取地理位置
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: latlng,
            key: "J6JBZ-HYHK6-T2WSP-EXKXS-2JIA3-CSBIS"
          },
          success: function (res) {
            var address = res.data.result.address
            if (res.statusCode == 200) {
              that.setData({
                address: address
              })
            }
          }
        })

        var nearclinic = {
          lng: latitude,
          lat: longitude,
          count: that.data.pageSize,
          start: that.data.page,
        }
        //调用全局加密方法
        var Dataclinic = app.mdkey(nearclinic);
        //console.log(Dataclinic)
        //附近的诊所
        wx.request({
          url: myWebsite + 'appNewCustomer/Index/nearClinic',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: Dataclinic,
          success: function (res) {
            if (res.statusCode == 200) {
              var list = res.data.data.clinic
              for (var i in list) {
                list[i]['distance'] = (list[i]['distance'] / 1000).toFixed(1) + "km"
              }
              var contentlistTem = that.data.contentlist
              if (that.data.page == 0) {
                contentlistTem = [];
              }
              if (list.length < that.data.pageSize) {
                that.setData({
                  clinic: contentlistTem.concat(list),
                  hasMoreData: false
                })
              } else {
                that.setData({
                  clinic: contentlistTem.concat(list),
                  hasMoreData: true,
                  page: that.data.page + 1,
                  hiddenLoading: true,
                  contentlist: contentlistTem.concat(list)
                })
              }
            }

          }
        });

      }
    });
  },
  //加载页面
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数
    app.getUserInfo(function (userInfo, Data) {
      //更新数据
      that.setData({
        userInfo: userInfo

      })
    })
    that.nearClinicList()

    //请求首页接口
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/index',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var Data = res.data.data;
          //console.log(Data)
          that.setData({
            indexInfo: Data,

          })

        }
      }
    });


  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    this.setData({
      page: 0,
      hiddenLoading: false
    });
    that.nearClinicList()
  },
  //上拉加载
  onReachBottom: function () {
    this.setData({
      hiddenLoading: false
    });
    if (this.data.hasMoreData) {
      this.nearClinicList()
    } 
  }

})
