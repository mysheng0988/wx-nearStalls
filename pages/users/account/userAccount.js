let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     data:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserAccount();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  openUserDetail(){
    let userId=this.data.userId;
    wx.navigateTo({
      url: '/pages/users/userDetail/detail?userId=' + userId,
    })
  },
  selectLocation(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        let data=that.data.data;
        var location = res.address
        data.location=location;
        data.latitude=res.latitude;
        data.longitude=res.longitude;
        that.setData({
          data,
        })
      }
    })
  },
  setSign(e) {
    let _this = this;
    var sign = e.detail.value;
    let data=this.data.data;
    data.sign=sign;
    _this.setData({
      data,
    })
  },
  setAddress(e){
    let _this = this;
    var address = e.detail.value;
    let data=this.data.data;
    data.address=address;
    _this.setData({
      data,
    })
  },
  updateAccount(e){
    let infoData=this.data.data;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var data = e.detail.userInfo;
      infoData.nickName=data.nickName;
      infoData.avatar=data.avatarUrl;
      }else{
        app.toast("获取用户信息失败")
        return
      }
   
    app.post({
      url: 'stalls/user/updateUser',
      method:"post",
      data: infoData
    })
      .then((res) => {
        app.toast(res.msg)
      })
  },
  changeStallsState(){
    let state=this.data.data.state;
    if(state==0){
      state=1
    }else{
      state=0
    }
    app.post({
      url: 'stalls/user/state/'+state,
      method:"get",
      data: {}
    }).then(res=>{
      if(res.code==0){
       wx.navigateBack({
         delta:1
       })
      }
      app.toast(res.msg)
    })
  },
  getUserAccount(){
    let that=this;
    app.post({
      url: 'stalls/user/userInfo',
      method:"post",
      data: {},
    })
      .then((res) => {
        if(res.code==0){
          let data=res.data;
          if(!data.location){
              data.location=wx.getStorageSync('location');
              data.longitude=wx.getStorageSync('longitude');
              data.latitude=wx.getStorageSync('latitude')
          }
          that.setData({
            data: data,
            userId:data.userId
          })
        }
      })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})