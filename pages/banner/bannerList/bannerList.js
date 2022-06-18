let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannerList()
  },
  getBannerList(){
    let that = this;
    app.post({
      url: 'stalls/banner/userTerms',
      method:"post",
      data: {},
    })
      .then((res) => {
        if(res.code==0){
          that.setData({
            bannerList: res.data
          })
        }
        
      })
  },
  auditDetail(e){
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/banner/bannerAudit/bannerAudit?id='+id,
    })
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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