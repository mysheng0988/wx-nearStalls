// pages/shopIndex/shopIndex.js
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    keyword:"",
    pageNum:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageNum=this.data.pageNum;
    let pageSize=this.data.pageSize;
    this.getGoodList(pageNum,pageSize)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      
  },
  setKeyword(e){
    let keyword= e.detail.value;
    this.setData({
      keyword,
    })
  },
  getSeachData(){
    this.setData({
      goodsList:[],
    })
    this.getGoodList(1,10);
  },
  getGoodList(pageNum,pageSize) {
    let that = this;
    let longitude=wx.getStorageSync('longitude');
    let latitude=wx.getStorageSync('latitude');
    let keyword=this.data.keyword;
  
   return app.post({
      url: 'stalls/goods/mine/list',
      method:"post",
      data: {
        keyword,
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
  auditDetail(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goodsAudit/goodsAudit?id='+id,
    })
  },
  auditSubmit(e){
    let id=e.currentTarget.dataset.id;
    let data={
      goodsId:id,
      handleType:1,
    }
      app.post({
        url:"stalls/audit/createRecord",
        method:"post",
        data:data,
      }).then(res=>{
        if(res.code==0){
          this.setData({
            goodsList:[]
          })
          this.getGoodList(1,10)
        }else{
          app.toast(res.msg)
        }
      })
  },
  makeOffGoods(e){
    let id=e.currentTarget.dataset.id;
    let goodsState=e.currentTarget.dataset.state==1?2:1;
    let data={
      goodsId:id,
      goodsState,
    }
      app.post({
        url:"stalls/goods/setting",
        method:"post",
        data:data,
      }).then(res=>{
        if(res.code==0){
          this.setData({
            goodsList:[]
          })
          this.getGoodList(1,10)
        }else{
          app.toast(res.msg)
        }
      })
  },
  openGoodsDetail(e){
    let id=e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/goods/goodsDetail?goodsId='+id,
      })
  },
  editGoodsPage(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/addGoods/addGoods?goodsId='+id,
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