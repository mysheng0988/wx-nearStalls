var QRCode = require("../../utils/weapp-qrcode.js")
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHidden:true,
    closeClass:true,
    goodsList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let token = app.globalData.token;
    if (token) {
      this.setData({
        nickName:app.globalData.nickName,
        phone:app.globalData.phone,
        token: token
      })
      this.getPersonData();
    }
  },
  followGoodsPage(){
    wx.navigateTo({
      url: '/pages/follow/followGoods',
    })
  },
  followUserPage(){
    wx.navigateTo({
      url: '/pages/follow/followUser',
    })
  },
  openIndex(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shopIndex/shopIndex?id='+id,
    })
  },
  switchToItem(e){
    let type=e.currentTarget.dataset.item;
    switch(type){
      case "account":
        wx.navigateTo({
          url: '/pages/users/account/userAccount',
        })
        break;
        case "goods":
        wx.navigateTo({
          url: '/pages/editGoods/editGoods',
        })
        break;
        case "banner":
          wx.navigateTo({
            url: '/pages/banner/bannerList/bannerList',
          })
          break;
        case "qrcode":
          this.showUserQRCode();
          break;
        case "scan":
          wx.scanCode({
            success (res) {
              console.log(res)
            }
          })
          break;

      }
  },
  hideModal() {
    this.setData({
      modalName: null
    })
  },
  tabIndex(e){
    let index = e.currentTarget.dataset.id;
    if(index==4){
      wx.navigateTo({
        url: '/pages/coupon/coupon',
      })
    }else{
      wx.navigateTo({
        url: '/pages/users/orderList/orderList?index=' + index,
      })
    }
   
  },
  getPersonData() {
    let that = this;
    return app.post({
      url: 'stalls/user/person/num',
      method:"get",
      data: {},
    })
      .then((res) => {
        wx.hideLoading()
        if (res.code == 0) {
          that.setData({
            count: res.data
          })
        }

      })

  },
  tologin(){
    wx.navigateTo({
      url: '/pages/phone/phone',
    })
  },
  setting(){
    if(!app.globalData.token){
     this.tologin()
    }else{
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    }
    
  },
  closeBtn(){
      this.setData({
        isHidden:false,
        closeClass:false
      })
  },
  getOrderNum(){
    let that=this;
   return app.post({
      url: 'office/order/userOrderNum',
      data: {},
    }).then(res => {
        if (res.code == 0) {
          that.setData({
            orderNum: res.data
          })
        }
        return res;
      })
  },
  showUserQRCode(){
    let token=this.data.token;
    var qrcode = new QRCode('canvas', {
      text: token,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    this.setData({
      modalName: "qrcode"
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(app.globalData.token){
      this.getPersonData().then(res=>{
        wx.stopPullDownRefresh()
      });
    }
    
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