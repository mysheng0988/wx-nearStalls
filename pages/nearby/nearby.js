var app = getApp();
//获取应用实例

Page({
  data: {
    userInfo: {},
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    shopList:[],
    imgPath: app.globalData.imgPath,
    swiperImg:[],
    pageNum:1,
    pageSize:10,
  },
  //事件处理函数

  onLoad: function (e) {
    this.getSwiperImg();
    this.getStallsList()
  },
  onShow:function(){
   
  },
  comeShopIndex(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userIndex/userIndex?id='+id,
    })
  },
  getSwiperImg() {
    let that = this;
    app.post({
      url: 'stalls/banner/userTerms',
      method:"post",
      data: {
        type: "1"
      },
    })
      .then((res) => {
        that.setData({
          swiperImg: res.data.items
        })
      })

  },
  getStallsList(pageNum,pageSize) {
    let that = this;
    let longitude = app.globalData.location.longitude;
    let latitude = app.globalData.location.latitude;
   return app.post({
      url: 'stalls/user/distance',
      method:"post",
      data: {
        pageNum,
        pageSize,
        longitude,
        latitude,
      },
    })
      .then((res) => {
       
        if(res.code==0){
          let shopList = [...that.data.shopList,...res.data.items];
          that.setData({
            shopList,
            pageNum:res.data.currentPage
          })
        }else if(res.code==601&&this.data.shopList.length>0){
          app.toast("没有更多数据了")
        }else{
          app.toast(res.msg)
        }
       
      })

  },
  onReachBottom(){
    let pageNum=this.data.pageNum;
     pageNum++
    let pageSize=this.data.pageSize;
    this.getStallsList(pageNum,pageSize);
 },
  onPullDownRefresh(){
    let pageNum=1;
    let pageSize=10;
    this.setData({
      shopList:[],
      pageNum,
      pageSize,
    })
    this.getStallsList(pageNum,pageSize).then(res=>{
      wx.stopPullDownRefresh()
    });
    
  },
  onShareAppMessage: function () {
    return {
      title: '解忧小酒馆，专治不开心~'
    }
  },
  
})