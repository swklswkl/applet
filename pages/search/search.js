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
    //分页数据
    keyword:null,
    page: 0,
    doctor_page:0,
    pageSize: 10,
    hasMoreData: true,
    hasMoreData_doctor:true,
    searchLoadingComplete:true,
    contentlist: [],
    doctorlist: [],
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
  //点击医生
  tapdoctor: function (e) {
    var doctor_id = e.currentTarget.dataset.doctor_id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/doctors/doctors?doctor_id=' + doctor_id + '&name=' + name 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      keyword: options.keyword
    })
    that.ClinicList(options.keyword)
    that.DoctorList(that.data.keyword)
  },
  //搜索诊所接口
  ClinicList: function (keyword) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var latlng = latitude + "," + longitude
        var searchClinic = {
          lng: latitude,
          lat: longitude,
          count: that.data.pageSize,
          start: that.data.page,
          keyword: keyword
        }
        //调用全局加密方法
        var searchClinic = app.mdkey(searchClinic);
        //console.log(Dataclinic)
        //附近的诊所
        wx.request({
          url: myWebsite + 'appNewCustomer/Index/searchClinic',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: searchClinic,
          success: function (res) {
            if (res.statusCode == 200) {
              var list = res.data.data.list.clinic
              var contentlistTem = that.data.contentlist
              for (var i in list) {
                list[i]['distance'] = (list[i]['distance'] / 1000).toFixed(1) + "km"
              }
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
                  contentlist: contentlistTem.concat(list)
                })
              }
            }

          }
        });

      }
    });
  },
  //搜索医生接口
  DoctorList: function (keyword) {
    var that = this;  
    var searchDoctor = {
      count: that.data.pageSize,
      start: that.data.doctor_page,
      keyword: keyword
    }
    //调用全局加密方法
    var searchDoctor = app.mdkey(searchDoctor);
    //console.log(Dataclinic)
    //附近的诊所
    wx.request({
      url: myWebsite + 'appNewCustomer/Index/searchDoctor',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: searchDoctor,
      success: function (res) {
        if (res.statusCode == 200) {
          
          var doctor_list = res.data.data.list.doctor
          var doctorlistTem = that.data.doctorlist
          
          if (that.data.doctor_page == 0) {
            doctorlistTem = [];
          }
          if (doctor_list.length < that.data.pageSize) {
            that.setData({
              doctor: doctorlistTem.concat(doctor_list),
              hasMoreData_doctor: false,
              searchLoadingComplete:false,
            })
          } else {
            that.setData({
              doctor: doctorlistTem.concat(doctor_list),
              hasMoreData_doctor: true,
              doctor_page: that.data.doctor_page + 1,
              doctorlist: doctorlistTem.concat(doctor_list)
            })
          }
        }

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
    var that = this
    if (that.data.hasMoreData) {
      that.ClinicList(that.data.keyword)
    } else {
      wx.showToast({
        title: '没有更多数据'
      })
    }
    if (that.data.hasMoreData_doctor) {
      that.DoctorList(that.data.keyword)
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})