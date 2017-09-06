var app = getApp()
var myWebsite = app.globalData.myWebsite;
var dateUtils = require("../../utils/dateUtils.js")
Page({
  data: {
    timepicker: null,
    date: null,
    time: null,
    clinic_id: null,
    customer_id: null,
    dateTitles: [
      "一", "二", "三", "四", "五", "六", "日"
    ],
    windowWidth: 0,
    windowHeight: 0,
    titleCellWidth: 0,
    titleCellHeight: 60, // rpx  
    dateCellWidth: 0,
    dateCellHeight: 120, // rpx  
    monthDatas: [],
    swiperHeight: 0,
    noclass_icon: "../../img/noclass_icon.png",

  },
  bindTimeChange: function (e) {
    var that = this
    that.setData({
      time: that.data.timepicker[e.detail.value]
    })

    wx.showModal({
      title: '预约信息核对',
      content: '是否确定预约' + that.data.date + ' ' + that.data.time + ' ' + that.data.clinicName,
      success: function (res) {
        var userInfo = wx.getStorageSync('userInfo')
        if (res.confirm && userInfo) {
          var getData = {
            customer_id: userInfo.customer_id,
            clinic_id: that.data.clinic_id,
            targetDate: that.data.date,
            hold_time: that.data.time,
          }
          var Data = app.mdkey(getData);
          wx.request({
            url: myWebsite + 'appNewCustomer/Appointment/Appointment',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: Data,
            method: 'post',
            success: function (res) {
              if (res.data.code == 0) {
                //跳转到上一个界面               
                wx.navigateTo({
                  url: '/pages/success/success?time=' + that.data.date + ' ' + that.data.time
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  image: '/image/icon/failure.png',
                })
              }
            }
          })
        } else {
          if (userInfo == null) {
            app.isLogin()
          }
        }
      }
    })
  },
  //点击date获取时间
  bindTimeclick: function (e) {
    var data = e.target.dataset.data
    this.setData({
      date: data.year + "-" + data.month + "-" + data.dateShow
    })
  },
  onLoad: function () {
    var that = this
    //获取经纬获取诊所
    wx.getLocation({
      success: function (res) {
        var Data = {
          lat: res.latitude,
          lng: res.longitude
        }
        var quizlist = app.mdkey(Data);
        wx.request({
          url: myWebsite + 'appNewCustomer/Appointment/index',
          method: 'post',
          data: quizlist,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              clinicName: res.data.data[0].clinicName,
              clinic_id: res.data.data[0].clinic_id
            })
            //获取诊所营业时间
            var Data = {
              clinic_id: res.data.data[0].clinic_id
            }
            var quizlist = app.mdkey(Data);
            wx.request({
              url: myWebsite + 'appNewCustomer/Appointment/getClinicTime',
              method: 'post',
              data: quizlist,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                that.setData({
                  timepicker: res.data.data

                })

              }
            })
          }
        })
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          titleCellWidth: res.windowWidth * 0.9 / 7,
          dateCellWidth: res.windowWidth * 0.9 / 7
        })
      }
    })
    var tmp = getInitDate()
    that.setData({
      monthDatas: tmp,
      swiperHeight: tmp[0].dataHarr.length * 122
    })
  },
  swiperChange: function (e) {
    var page = e.detail.current
    this.setData({
      swiperHeight: this.data.monthDatas[page].dataHarr.length * 122
    })
  }
})
function getInitDate() {
  var arr = []
  var offset = 0
  arr.push(getDataObj(dateUtils.initThisMonthDates(offset)))
  arr.push(getDataObj(dateUtils.initNextMonthDates(offset)))
  return arr
}

function getDataObj(arr) {
  var obj = {
    data: arr,
    dataHarr: dateUtils.initRowList(arr.length / 7)
  }
  return obj
}  