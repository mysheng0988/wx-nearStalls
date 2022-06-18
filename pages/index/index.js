//获取应用实例
const app = getApp()
let utils = require('../../utils/util.js')
Page({
  data: {
    index: 1,
    indicatorDots: true,
    notice:false,
    TabCur: 0,
    scrollLeft: 0,
    tabNav:[{"id":"10001","classCode":"","className":"综合推荐"}],
    goodsType:"",
    goodsList:[],
    autoplay: true,
    interval: 4000,
    duration: 500,
    pageNum:1,
    pageSize:10
  },
  
  onLoad: function () {
    let that=this;
   this.getSwiperImg();
   this.getGoodList(1,10);
   this.getClassData();
  },
  onShow: function () {

  },
  searchGoods(){
      wx.navigateTo({
        url: '/pages/search/search',
      })
  },
  scanQRcode(){
    wx.scanCode({
      success (res) {
       app.toast("敬请期待")
      }
    })
  },
  getClassData(){
    app.post({
      url: 'stalls/class/list',
      method:"post",
      data: {},
    })
      .then((res) => {
        if(res.code==0){

          let tabNav=[...this.data.tabNav,...res.data]
          this.setData({
            tabNav: tabNav
          })
        }
      })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      goodsType:e.currentTarget.dataset.type,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 80
    })
    let pageNum=1;
    let pageSize=10;
    this.setData({
      pageSize,
      pageNum,
      goodsList:[]
    })
   this.getGoodList(pageNum,pageSize);
  },
  goodsDetail(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goodsDetail?goodsId='+id,
    })
  },
  shopIndex(){
    wx.navigateTo({
      url: '/pages/shopIndex/shopIndex'
    })
  },
  hideNotice(){
    this.setData({
      notice:true,
    })
  },
  getSwiperImg(){
    let that=this;
    app.post({
      url: 'stalls/banner/list',
      method:"post",
      data: {
        type:"0"
      },
    })
      .then((res) => {
        that.setData({
          swiperImg: res.data.items
        })
      })

  },
  getGoodList(pageNum,pageSize) {
    let that = this;
    let longitude=wx.getStorageSync('longitude')
    let latitude=wx.getStorageSync('latitude')
    let goodsType=this.data.goodsType;
    return app.post({
      url: 'stalls/goods/list',
      method:"post",
      data: {
        goodsType,
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
       return res;
      })

  },
  getSeckill() {
    let that = this;
    app.post({
      url: 'office/kill/userTerms',
      data: {},
    })
      .then((res) => {
        that.setData({
          killList: res.data.items
        })
      })

  },
  navIndexPage(e){
    let id=e.currentTarget.dataset.id;
    let label = e.currentTarget.dataset.label;
    if(id==17){
      wx.navigateTo({
        url: '/pages/clothing/clothing?id=' + id + "&label=" + label
      })
    }else if(id==18){
      app.toast("敬请期待")
    }else{
      wx.navigateTo({
        url: '/pages/navIndex/navIndex?id=' + id + "&label=" + label
      })
    }
   
  },
  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      index: e.detail.current + 1
    })
  },
  clickItem() {
    let index=this.data.index;
    switch (index){
      case 1:
        wx.navigateTo({
          url: "/pages/indexes/indexes?title=店铺搜索"
        })
      break
      case 2:
        wx.navigateTo({
          url: "/pages/shopIndex/shopIndex?title=店铺搜索"
        })
        break
    }
   
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
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
