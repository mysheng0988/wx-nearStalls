let app=getApp();
let wxst = null;
Page({
  data: {
    InputBottom: 0,
    sendVaule: '',
    msgList: [],
    toUser: '5ad7707ae7d845329c5c3d2ba8c261b8',
  },
  onLoad(){
    this.setData({
      userId:app.globalData.userId
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
    this.startConnect();
  },
  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
   onHide() {
    this.closeOne();
  },
  onUnload() {
    this.closeOne();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  startConnect: function () {
    //本地测试使用 ws协议 ,正式上线使用 wss 协议
    let userId = app.globalData.userId;
    let that = this;
    var url = 'ws://192.168.1.108:9326/?token=' + userId;
    wxst = wx.connectSocket({
      url: url,
      header: {
        token: userId,
      },
      method: "GET"
    });
    wxst.onOpen(res => {
      console.info('连接打开成功');
    });
    wxst.onError(res => {
      console.info('连接识别');
      console.error(res);
    });
    wxst.onMessage(res => {
      let obj =JSON.parse(res.data)
      console.log(obj)
      wx.startRecord({
        success(res){

          console.log(res)
          wx.playVoice({
            filePath: "/utils/default.mp3",
            fail(res){
              console.log(res)
            },
            complete(res) {
              console.log()
              wx.stopVoice(res);
             }
          })
        }, 
        fail(res) {
          console.log(res)
        },
      })
     
      // wx.playBackgroundAudio({
      //   dataUrl: '',
      // })
      let msgList = that.data.msgList;
      var data = JSON.parse(res.data);

      msgList.push(data.message);
      that.setData({
        msgList,
      })
      //console.info(data);
    });
    wxst.onClose(() => {
      console.info('连接关闭');
    });
  },
  sendOne() {
    let that = this;
    let msgList=that.data.msgList;
    let sendVaule={
      code: "2",
      message: {
        username: app.globalData.loginName,
        avatar: app.globalData.avatar,
        content: that.data.sendVaule,
        type:"0",
        id: that.data.toUser,
        fromid: app.globalData.userId,

      }
    }
   
    let str = JSON.stringify(sendVaule)
    console.log(str)
    wx.sendSocketMessage({
      data:str,
      success(res){
        msgList.push(sendVaule.message)
        that.setData({
          msgList: msgList,
          sendVaule: ""
        })
      }
    })
    // app.post({
    //   url: 'office/chat/save',
    //   data: sendVaule
    // })
    //   .then((res) => {
    //     console.log(res)
    //     msgList.push(sendVaule)
    //     that.setData({
    //       msgList: msgList,
    //       sendVaule: ""
    //     })
    //   })

  },

  setInputValue(e) {
    this.setData({
      sendVaule: e.detail.value
    })
  },
  //关闭连接
  closeOne: function () {
    wxst.close();
  },
})