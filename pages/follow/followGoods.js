let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    pageNum:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getfollowGoods()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  getData(){
     this.setData({
      goodsList:[],
     })
      this.getfollowGoods(1,10)
  },
  getfollowGoods(pageNum,pageSize){
   
   return app.post({
      url: 'stalls/follow/goods/list',
      method:"post",
      data: {
        pageNum,
        pageSize,
      },
    })
      .then((res) => {
        if(res.code==0){
          let goodsList=[...this.data.goodsList,... res.data.items]
          this.setData({
            goodsList,
            pageNum:res.data.currentPage
          })
        }else if(res.code==601&&this.data.goodsList.length>0){
          app.toast("没有更多数据了")
        }else{
          app.toast(res.msg)
        }
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let pageNum=1;
    let pageSize=10;
    this.setData({
      goodsList:[],
      pageNum,
      pageSize,
    })
    this.getfollowGoods(pageNum,pageSize).then(res=>{
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pageNum=this.data.pageNum;
    pageNum++;
    let pageSize=this.data.pageSize;
    this.getfollowGoods(pageNum,pageSize);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})