// advisory.js
var app = getApp();
var myWebsite = app.globalData.myWebsite;
Page({
  data: {
    // text:"这是一个页面"
    p1: 'block',
    i1: 'none',
    p2: 'block',
    i2: 'none',
    p3: 'block',
    i3: 'none',
    avatarUrl1: '',
    avatarUrl2: '',
    avatarUrl3: '',
    tag1:'block',
    tag2:'none',
    toast1Hidden: true,
    modalHidden: true,
    notice_str: '',
    objectArray: ['牙体治疗', '牙周治疗', '口腔修复', '口腔种植', '口腔外科', '口腔正畸', '儿童牙科', '口腔美容', '口腔预防','综合治疗'],
    index: 0,
    user: ''
  },
  bindViewTap1: function () {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;

        that.setData({
          //将临时变量赋值给已经在data中定义好的变量
          avatarUrl1: tempFilePaths[0],
          p1: 'none',
          i1: 'block'
        })

        wx.uploadFile({
          url: myWebsite+'appNewCustomer/Common/pictureUp', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data)
            //console.log(data.data)
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  bindViewTap2: function () {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;

        that.setData({
          //将临时变量赋值给已经在data中定义好的变量
          avatarUrl2: tempFilePaths[0],
          p2: 'none',
          i2: 'block'
        })

        wx.uploadFile({
          url: myWebsite +'appNewCustomer/Common/pictureUp', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data)
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  bindViewTap3: function () {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;

        that.setData({
          //将临时变量赋值给已经在data中定义好的变量
          avatarUrl3: tempFilePaths[0],
          p3: 'none',
          i3: 'block'
        })

        wx.uploadFile({
          url: myWebsite +'appNewCustomer/Common/pictureUp', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data)
            console.log(data.data)
          }
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  toast1Change: function (e) {
    this.setData({ toast1Hidden: true });
  },
  //弹出确认框  
  modalTap: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  confirm_one: function (e) {
    //console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '提交成功'
    });
  },
  cancel_one: function (e) {
    //console.log(e);
    this.setData({
      modalHidden: true,
      toast1Hidden: false,
      notice_str: '取消成功'
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      tag1:'none',
      tag2:'block',
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data) {
          // Do something with return value
          that.setData({
            user: res.data,
          })
        }
      }
    }),
    wx.request({
      url: myWebsite +'appNewCustomer/Index/tag_icon', 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
          var Data = res.data.data;
          that.setData({
            array: Data,
          })
      }
    })  
  },
  onReady: function () {
    // 页面渲染完成  
  },
  onShow: function () {
    // 页面显示  
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        if (res.data) {
          // Do something with return value
          that.setData({
            user: res.data,
          })
        }
      }
    })
  },
  onHide: function () {
    // 页面隐藏  
  },
  onUnload: function () {
    // 页面关闭  
  },
  formSubmit: function (e) {
    var that = this;
    if (this.data.user == ''){
      app.isLogin()
    }else{
        var contents = e.detail.value.content;
        if (contents == ''){
            this.setData({
              modalHidden: true,
              toast1Hidden: false,
              notice_str: '请简单的描述下问题'
            });
          }else{
              var advisory = {
                    customer_id: that.data.user.customer_id,
                    tag_id: e.detail.value.tag_id,
                    open: e.detail.value.open,
                    content: contents,
                    photo1: that.data.avatarUrl1,
                    photo2: that.data.avatarUrl2,
                    photo3: that.data.avatarUrl3,
              }
              //调用全局加密方法
              var formData = app.mdkey(advisory);
              wx.request({
                  url: myWebsite+'appNewCustomer/Advisory/consult',
                  data: formData,
                  method: 'POST',
                  header: {
                  'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                      //that.modalTap();
                      if (res.data.code == 0){
                          that.setData({
                              modalHidden: true,
                              toast1Hidden: false,
                              notice_str: '咨询成功',
                              p1: 'block',
                              i1: 'none',
                              p2: 'block',
                              i2: 'none',
                              p3: 'block',
                              i3: 'none',
                              contents:'',
                              tag1: 'block',
                              tag2: 'none'
                          });
                          setTimeout(function () {
                            wx.navigateTo({
                            url: '/pages/okadvisory/okadvisory',
                            })
                          }, 1500)
                      }
                  }
              })
            }
    }
  }
})  