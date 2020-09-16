let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[],
    pageNum:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageNum=this.data.pageNum;
    let pageSize=this.data.pageSize;
      this.getfollowUser(pageNum,pageSize);
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  comeShopIndex(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userIndex/userIndex?id='+id,
    })
  },
  getfollowUser(pageNum,pageSize){
    let data=this.data.shopList;
   return app.post({
      url: 'stalls/follow/follow/user',
      method:"post",
      data: {
        pageNum,
        pageSize,
      },
    })
      .then((res) => {
        if(res.code==0){
          let shopList=[...data,...res.data.items]
          this.setData({
            shopList,
            pageNum:res.data.currentPage
          })
        }else{
          this.setData({
            shopList:[],
            pageNum:1
          })
          app.toast(res.msg)
        }
      })
  },
  cancelFollowUser(e){
    let id = e.currentTarget.dataset.id;
    app.post({
      url: 'stalls/follow/cancel/'+id,
      method:"get",
      data: { },
    }).then(res=>{
      if(res.code==0){
        this.setData({
          shopList:[],
          pageNum:1,
        })
        this.getfollowUser(1,10);
      }
      app.toast(res.msg)
    })
  },
  onReachBottom(){
    let pageNum=this.data.pageNum;
    pageNum++;
    let pageSize=this.data.pageSize;
    this.getfollowUser(pageNum,pageSize);
 },
  onPullDownRefresh(){
    let pageNum=1;
    let pageSize=10;
    this.setData({
      shopList:[],
      pageNum,
      pageSize,
    })
    this.getfollowUser(pageNum,pageSize).then(res=>{
      wx.stopPullDownRefresh()
    }); 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})