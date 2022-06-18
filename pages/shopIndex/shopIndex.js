// pages/shopIndex/shopIndex.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur:0,
    tabText:["商品","活动","上新"],
    imgPath: app.globalData.imgPath,
    goodsList:[],
    swiperImg:[],
    pageNum:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserMsgInfo()
    this.getSwiperImg();
    let pageNum=this.data.pageNum;
    let pageSize=this.data.pageSize;
    this.getGoodList(pageNum,pageSize)
  },

  editStallsUser(){
     wx.navigateTo({
       url: '/pages/editGoods/editGoods',
     })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },
  getGoodList(pageNum,pageSize) {
    let that = this;
    let longitude=wx.getStorageSync('longitude')
    let latitude=wx.getStorageSync('latitude')
   return app.post({
      url: 'stalls/goods/mine/list',
      method:"post",
      data: {
        longitude,
        latitude,
        pageNum,
        pageSize,
      },
    })
      .then((res) => {
        if(res.code==0){
          let goodsList=[...this.data.goodsList,...res.data.items]
          that.setData({
            goodsList: goodsList,
            pageNum:res.data.currentPage
          })
        }else if(res.code==601&&this.data.goodsList.length>0){
            app.toast("没有更多数据了")
        }else{
          app.toast(res.msg)
        }
       
      })

  },
  addGoodsPage(){
    wx.navigateTo({
      url: '/pages/addGoods/addGoods',
    })
  },
  getUserMsgInfo(userId) {
    let that = this;
    let longitude=wx.getStorageSync('longitude')
    let latitude=wx.getStorageSync('latitude')
    app.post({
      url: 'stalls/user/userInfo/userId',
      method:"post",
      data: {
        longitude,
        latitude,
      },
    })
      .then((res) => {
        if(res.code==0){
          that.setData({
            userMsg: res.data
          })
        }
      })
  },
  getSwiperImg() {
    let that = this;
    app.post({
      url: 'stalls/banner/userTerms',
      method:"post",
      data: {
        type: "2"
      },
    })
      .then((res) => {
        if(res.code==0){
          that.setData({
            swiperImg: res.data
          })
        }
        
      })
  },
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  onPullDownRefresh(){
    let pageNum=1;
    let pageSize=10;
    this.setData({
      goodsList:[],
      pageNum,
      pageSize,
    })
    this.getGoodList(pageNum,pageSize).then(res=>{
      wx.stopPullDownRefresh()
    });
   },
   onReachBottom(){
    let pageNum=this.data.pageNum;
    pageNum++;
    let pageSize=this.data.pageSize;
      this.getGoodList(pageNum,pageSize);
   },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})