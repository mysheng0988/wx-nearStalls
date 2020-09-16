let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur:0,
    CustomBar: app.globalData.CustomBar,
    imgPath: app.globalData.imgPath,
    orderList:[],
    currentPage:1,
    pageSize:10,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tabCur =options.index;
    //let tabCur = 0;
    this.setData({
      tabCur,
    })
    this.getOrderList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
    })
    this.changeStateOrderList();
  },
  changeStateOrderList(){
    let orderList=[]
    let currentPage = 1;
    let pageSize = 10;
    this.setData({
      currentPage,
      pageSize,
      orderList,
    })
    this.getOrderList();
  },
  getOrderList(){
    let that=this;
    let currentPage = this.data.currentPage;
    let pageSize = this.data.pageSize;
    let state = this.data.tabCur - 1 < 0 ? null :this.data.tabCur - 1;
    wx.showLoading({
      title: '数据加载中',
      mask:true,
    })
    app.post({
      url: 'office/order/orderList',
      data: {
        currentPage,
        pageSize,
        state,
      },
    })
      .then((res) => {
        wx.hideLoading();
        if (res.code == 0) {
          let list = res.data.items;
          let orderList = that.data.orderList
          orderList = orderList.concat(list)
          let currentPage = this.data.currentPage + 1;
          that.setData({
            orderList,
            currentPage,
          })
        }else if(res.code==1){
           app.toast("没有更多数据了！")
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
     this.getOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})