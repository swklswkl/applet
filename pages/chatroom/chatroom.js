var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

var RecordStatus = {
    SHOW: 0,
    HIDE: 1,
    HOLD: 2,
    SWIPE: 3,
    RELEASE: 4
}

var RecordDesc = {
    0: '长按开始录音',
    2: '向上滑动取消',
    3: '松开手取消',
}

Page({
    data: {
        chatMsg: [],
        emojiStr: '',
        yourname: '',
        myName: '',
        sendInfo: '',
        userMessage: '',
        inputMessage: '',
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        show: 'emoji_list',
        view: 'scroll_view',
        toView: '',
        emoji: WebIM.Emoji,
        emojiObj: WebIM.EmojiObj,
        msgView: {},
        RecordStatus: RecordStatus,
        RecordDesc: RecordDesc,
        recordStatus: RecordStatus.HIDE,
    },
    onLoad: function () {
        var that = this
        var options = wx.getStorageSync('userInfo')
        var myName = options.customer_id
        this.setData({
            yourname: options.hx_service_id,
            myName: myName,
            inputMessage: '',
            chatMsg: wx.getStorageSync(options.hx_service_id + myName) || []
        })
        wx.setNavigationBarTitle({
            title: '客服'
        })
        //登录
        var options = {
          apiUrl: WebIM.config.apiURL,
          user: that.data.myName,
          pwd: that.data.myName,
          appKey: WebIM.config.appkey
        };        
        WebIM.conn.open(options);
    },
    onShow: function () {
        var that = this
        this.setData({
            inputMessage: ''
        })
    },
    bindMessage: function (e) {
        this.setData({
            userMessage: e.detail.value
        })
    },
    cleanInput: function () {
        var that = this
        var setUserMessage = {
            sendInfo: that.data.userMessage
        }
        that.setData(setUserMessage)
    },
    sendMessage: function () {      
        if (!this.data.userMessage.trim()) return;
        var that = this
        // //console.log(that.data.sendInfo)
        var myName = that.data.myName
        var id = WebIM.conn.getUniqueId();       
        var msg = new WebIM.message('txt', id);
        msg.set({
            msg: that.data.sendInfo,
            to: that.data.yourname,
            roomType: false,
            success: function (id, serverMsgId) {
                
            }         
        });
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
        if (msg) {
            var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
                info: {
                    to: msg.body.to
                },
                username: that.data.myName,
                yourname: msg.body.to,
                msg: {
                    type: msg.type,
                    data: value
                },
                style: 'self',
                time: time,
                mid: msg.id
            }           
            that.data.chatMsg.push(msgData)         
            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg,
                        emojiList: [],
                        inputMessage: ''
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
            
            that.setData({
                userMessage: ''
            })
        }
    },

    receiveMsg: function (msg, type) {
        var that = this
        var myName = that.data.myName
        if (msg.from == that.data.yourname || msg.to == that.data.myName) {
            if (type == 'txt') {
                var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
            } else if (type == 'emoji') {
                var value = msg.data
            } else if(type == 'audio'){
                // 如果是音频则请求服务器转码
               
                var token = msg.accessToken;
                
                var options = {
                    url: msg.url,
                    header: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'audio/mp3',
                        'Authorization': 'Bearer ' + token
                    },
                    success: function(res){
                        console.log('downloadFile success Play', res);
                        // wx.playVoice({
                            // filePath: res.tempFilePath
                        // })
                        msg.url = res.tempFilePath
                        var msgData = {
                            info: {
                                from: msg.from,
                                to: msg.to
                            },
                            username: '',
                            yourname: msg.from,
                            msg: {
                                type: type,
                                data: value,
                                url: msg.url
                            },
                            style: '',
                            time: time,
                            mid: msg.type + msg.id
                        }

                        if (msg.from == that.data.yourname) {
                            msgData.style = ''
                            msgData.username = msg.from
                        } else {
                            msgData.style = 'self'
                            msgData.username = msg.to
                        }

                        var msgArr = that.data.chatMsg;
                        msgArr.pop();
                        msgArr.push(msgData);

                        that.setData({
                            chatMsg: that.data.chatMsg,
                        })
                        console.log("New audio");
                    },
                    fail: function(e){
                        console.log('downloadFile failed', e);
                    }
                };
                console.log('Download');
                wx.downloadFile(options);
            }
           
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: '',
                yourname: msg.from,
                msg: {
                    type: type,
                    data: value,
                    url: msg.url
                },
                style: '',
                time: time,
                mid: msg.type + msg.id
            }
           
            if (msg.from == that.data.yourname) {
                msgData.style = ''
                msgData.username = msg.from
            } else {
                msgData.style = 'self'
                msgData.username = msg.to
            }
            
            that.data.chatMsg.push(msgData)
            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    if(type == 'audio')
                        return;
                    that.setData({
                        chatMsg: that.data.chatMsg,
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
           
        }
    },
    openEmoji: function () {
        this.setData({
            show: 'showEmoji',
            view: 'scroll_view_change'
        })
    },
    sendEmoji: function (event) {
        var that = this
        var emoji = event.target.dataset.emoji
        var msglen = that.data.userMessage.length - 1
        if (emoji && emoji != '[del]') {
            var str = that.data.userMessage + emoji
        } else if (emoji == '[del]') {
            var start = that.data.userMessage.lastIndexOf('[')
            var end = that.data.userMessage.lastIndexOf(']')
            var len = end - start
            if (end != -1 && end == msglen && len >= 3 && len <= 4) {
                var str = that.data.userMessage.slice(0, start)
            } else {
                var str = that.data.userMessage.slice(0, msglen)
            }
        }
        this.setData({
            userMessage: str,
            inputMessage: str
        })
    },
    sendImage: function () {
        var that = this
        var pages = getCurrentPages()
        console.log(pages)
        that.cancelEmoji()
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function (res) {
              if (that) {
                  that.upLoadImage(res, that)
                }
            }
        })
    },

    sendLocation: function() {
        var that = this
        var pages = getCurrentPages()
        pages[1].cancelEmoji()
        wx.chooseLocation({
            success: function(respData){
                var id = WebIM.conn.getUniqueId();
                var msg = new WebIM.message('location', id);
                msg.set({
                    msg: that.data.sendInfo,
                    to: that.data.yourname,
                    roomType: false,
                    lng: respData.longitude,
                    lat: respData.latitude,
                    addr: respData.address,
                    success: function (id, serverMsgId) {
                        //console.log('success')
                    }
                });
                // //console.log(msg)
                msg.body.chatType = 'singleChat';
                WebIM.conn.send(msg.body);
            }
        })
    },

    testInterfaces: function(){
        var option = {
            roomId: '21873157013506',
            success: function(respData){
                wx.showToast({
                    title: "JoinChatRoomSuccess",
                });
                console.log('Response data: ', respData);
            }
        };
        wx.showToast({
            title: "JoinChatRoom",
        });
        WebIM.conn.joinChatRoom(option);
        // var option = {
        //     apiUrl: WebIM.config.apiURL,
        //     pagenum: 1,
        //     pagesize: 20,
        //     success: function(resp){
        //         console.log(resp);
        //     },
        //     error: function(e){
        //         console.log(e);
        //     }
        // };
        // WebIM.conn.getChatRooms(option);
    },
    // sendVideo: function() {
    //     var that = this
    //     wx.chooseVideo({
    //         sourceType: ['album', 'camera'],
    //         maxDuration: 60,
    //         camera: 'back',
    //         success: function(res) {
    //             console.log(res)
    //             var tempFilePaths = res.tempFilePath
    //             var str = WebIM.config.appkey.split('#')
    //             wx.uploadFile({
    //                 url: 'https://a1.easemob.com/'+ str[0] + '/' + str[1] + '/chatfiles',
    //                 filePath: tempFilePaths,
    //                 name: 'file',
    //                 header: {
    //                     'Content-Type': 'multipart/form-data'
    //                 },
    //                 success: function (res) {
    //                         var data = res.data

    //                         var dataObj = JSON.parse(data)
    //                         console.log(dataObj)
    //                         var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
    //                         var msg = new WebIM.message('img', id);
    //                         console.log(msg)
    //                         var file = {
    //                             type: 'img',
    //                             'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
    //                             'filetype': 'mp4',
    //                             'filename': tempFilePaths
    //                         }
    //                         //console.log(file)
    //                         var option = {
    //                             apiUrl: WebIM.config.apiURL,
    //                             body: file,
    //                             to: that.data.yourname,                  // 接收消息对象
    //                             roomType: false,
    //                             chatType: 'singleChat'
    //                         }
    //                         msg.set(option)
    //                         WebIM.conn.send(msg.body)
    //                         if (msg) {
    //                             //console.log(msg,msg.body.body.url)
    //                             var time = WebIM.time()
    //                             var msgData = {
    //                                 info: {
    //                                     to: msg.body.to
    //                                 },
    //                                 username: that.data.myName,
    //                                 yourname: msg.body.to,
    //                                 msg: {
    //                                     type: msg.type,
    //                                     data: msg.body.body.url
    //                                 },
    //                                 style: 'self',
    //                                 time: time,
    //                                 mid: msg.id
    //                             }
    //                             that.data.chatMsg.push(msgData)
    //                             console.log(that.data.chatMsg)
    //                             var myName = wx.getStorageSync('myUsername')
    //                             wx.setStorage({
    //                                 key: that.data.yourname + myName,
    //                                 data: that.data.chatMsg,
    //                                 success: function () {
    //                                     //console.log('success', that.data)
    //                                     that.setData({
    //                                         chatMsg: that.data.chatMsg
    //                                     })
    //                                     setTimeout(function () {
    //                                         that.setData({
    //                                             toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
    //                                         })
    //                                     }, 10)
    //                                 }
    //                             })
    //                         }

    //                 }
    //             })
    //         }
    //     })
    // },
    receiveImage: function (msg, type) {
        var that = this
        var myName = wx.getStorageSync('myUsername')
        //console.log(msg)
        if (msg) {
            //console.log(msg)
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: msg.from,
                yourname: msg.from,
                msg: {
                    type: 'img',
                    data: msg.url
                },
                style: '',
                time: time,
                mid: 'img' + msg.id
            }
            //console.log(msgData)
            that.data.chatMsg.push(msgData)
            //console.log(that.data.chatMsg)
            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
        }
    },

receiveVideo: function (msg, type) {
        var that = this
        var myName = wx.getStorageSync('myUsername')
        //console.log(msg)
        if (msg) {
            //console.log(msg)
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: msg.from,
                yourname: msg.from,
                msg: {
                    type: 'video',
                    data: msg.url
                },
                style: '',
                time: time,
                mid: 'video' + msg.id
            }
            //console.log(msgData)
            that.data.chatMsg.push(msgData)
            //console.log(that.data.chatMsg)
            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
        }
    },

    openCamera: function () {
        var that = this
        var pages = getCurrentPages()
        that.cancelEmoji()
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function (res) {
              that.upLoadImage(res, that)               
            }
        })
    },
    focus: function () {
        this.setData({
            show: 'emoji_list',
            view: 'scroll_view'
        })
    },
    cancelEmoji: function () {
        this.setData({
            show: 'emoji_list',
            view: 'scroll_view'
        })
    },
    scroll: function (e) {
        // //console.log(e)
    },
    lower: function (e) {
        //console.log(e)
    },
    upLoadImage: function (res, that) {
        //console.log(res)
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths)
        wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
                // console.log(res)
                var allowType = {
                    'jpg': true,
                    'gif': true,
                    'png': true,
                    'bmp': true
                };
                var str = WebIM.config.appkey.split('#')
                var width = res.width
                var height = res.height
                var index = res.path.lastIndexOf('.')
                if (index != -1) {
                    var filetype = res.path.slice(index + 1)
                }
                if (filetype.toLowerCase() in allowType) {
                    wx.uploadFile({
                        url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
                        filePath: tempFilePaths[0],
                        name: 'file',
                        header: {
                            'Content-Type': 'multipart/form-data'
                        },
                        success: function (res) {
                            var data = res.data
                            var dataObj = JSON.parse(data)
                            // console.log(dataObj)
                            var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
                            var msg = new WebIM.message('img', id);
                            var file = {
                                type: 'img',
                                size: {
                                    width: width,
                                    height: height
                                },
                                'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                                'filetype': filetype,
                                'filename': tempFilePaths[0]
                            }
                            //console.log(file)
                            var option = {
                                apiUrl: WebIM.config.apiURL,
                                body: file,
                                to: that.data.yourname,                  // 接收消息对象
                                roomType: false,
                                chatType: 'singleChat'
                            }
                            msg.set(option)
                            WebIM.conn.send(msg.body)
                            if (msg) {
                                //console.log(msg,msg.body.body.url)
                                var time = WebIM.time()
                                var msgData = {
                                    info: {
                                        to: msg.body.to
                                    },
                                    username: that.data.myName,
                                    yourname: msg.body.to,
                                    msg: {
                                        type: msg.type,
                                        data: msg.body.body.url,
                                        size: {
                                            width: msg.body.body.size.width,
                                            height: msg.body.body.size.height,
                                        }
                                    },
                                    style: 'self',
                                    time: time,
                                    mid: msg.id
                                }
                                that.data.chatMsg.push(msgData)
                                //console.log(that.data.chatMsg)
                                var myName = wx.getStorageSync('myUsername')
                                wx.setStorage({
                                    key: that.data.yourname + myName,
                                    data: that.data.chatMsg,
                                    success: function () {
                                        //console.log('success', that.data)
                                        that.setData({
                                            chatMsg: that.data.chatMsg
                                        })
                                        setTimeout(function () {
                                            that.setData({
                                                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                                            })
                                        }, 10)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    previewImage: function (event) {
        var url = event.target.dataset.url
        wx.previewImage({
            urls: [url]  // 需要预览的图片http链接列表
        })
    }
})

















