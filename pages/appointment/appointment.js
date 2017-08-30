var app = getApp()  
  
var dateUtils = require("../../utils/dateUtils.js")  
  
Page({  
    data : {  
      multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']],
      objectMultiArray: [
        [
          {
            id: 0,
            name: '无脊柱动物'
          },
          {
            id: 1,
            name: '脊柱动物'
          }
        ], [
          {
            id: 0,
            name: '扁性动物'
          },
          {
            id: 1,
            name: '线形动物'
          },
          {
            id: 2,
            name: '环节动物'
          },
          {
            id: 3,
            name: '软体动物'
          },
          {
            id: 3,
            name: '节肢动物'
          }
        ]
      ],
      multiIndex: [0, 0],
      timepicker:['9:00', '10:00', '11:00', '12:00', '13:00', '14:00','15:00', '16:00', '17:00'],
        dateTitles : [  
            "一", "二", "三", "四", "五", "六", "日"  
        ],  
        windowWidth : 0,  
        windowHeight : 0,  
        titleCellWidth : 0,  
        titleCellHeight : 60, // rpx  
        dateCellWidth : 0,  
        dateCellHeight : 120, // rpx  
        monthDatas: [],  
        swiperHeight :0,  
        noclass_icon : "../../img/noclass_icon.png",  
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    }, 
    bindMultiPickerColumnChange: function (e) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      var data = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      };
      data.multiIndex[e.detail.column] = e.detail.value;
      switch (e.detail.column) {
        case 0:
          switch (data.multiIndex[0]) {
            case 0:
              data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
              break;
            case 1:
              data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
              break;
          }
          data.multiIndex[1] = 0;
          data.multiIndex[2] = 0;
          break;
        case 1:
          break;
      }
      this.setData(data);
  },
  bindTimeChange: function (e) {
    console.log(this)
    this.setData({
      time: e.detail.value
    })
    wx.showModal({
      title: '预约信息核对',
      content: '是否确定预约XXX号XXX日' + e.detail.value + this.data.multiArray[0][this.data.multiIndex[0]] + '诊所' + this.data.multiArray[1][this.data.multiIndex[1]]+ '医生',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/appointment/success'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
    onLoad: function(){  
        var that = this  
        wx.getSystemInfo({  
          success: function(res) {  
            that.setData({  
                windowWidth : res.windowWidth,  
                windowHeight : res.windowHeight,  
                titleCellWidth: res.windowWidth * 0.9/7,  
                dateCellWidth : res.windowWidth*0.9/7  
            })  
          }  
        })  
  
        var tmp = getInitDate()  
        console.log(tmp)
        that.setData({  
            monthDatas : tmp,  
            swiperHeight : tmp[0].dataHarr.length * 122  
        })  
    },  
    swiperChange: function(e){  
        var page = e.detail.current  
        this.setData({  
            swiperHeight : this.data.monthDatas[page].dataHarr.length * 122  
        })  
    }  
})  
  
function getInitDate(){  
    var arr = []  
    var offset = 0  
    arr.push(getDataObj(dateUtils.initThisMonthDates(offset)))  
    arr.push(getDataObj(dateUtils.initNextMonthDates(offset)))  
    return arr  
}  
  
function getDataObj(arr){  
    var obj = {  
        data: arr,  
        dataHarr:dateUtils.initRowList(arr.length/7)  
    }  
    return obj  
}  