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
    swiperImg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId=options.id;
    this.setData({
      userId,
    })
    this.getUserMsgInfo(userId)
    this.getSwiperImg();
    this.getGoodList(1,10)
  },

  followUser(){
    let  userId=this.data.userId;
    let userMsg=this.data.userMsg
    let that=this;
    app.post({
      url: 'stalls/follow/change/user/'+userId,
      method:"get",
      data: {
      },
    })
      .then((res) => {
        if(res.code==0){
          userMsg.isFollowUser=!userMsg.isFollowUser
          let msg= userMsg.isFollowUser?"已关注":"取消关注"
          app.toast(msg)
         that.setData({
          userMsg,
         })
    
        }else{
          app.toast(res.msg)
        }
       
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
    let userId=this.data.userId;
   return app.post({
      url: 'stalls/goods/user/list',
      method:"post",
      data: {
        longitude,
        latitude,
        userId,
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
        userId
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
        console.log(res)
        that.setData({
          swiperImg: res.data.items
        })
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