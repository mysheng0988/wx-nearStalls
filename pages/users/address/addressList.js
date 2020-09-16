let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    pageNum:1,
    pageSize:10,
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
    this.getAddress();
  },
  getAddress() {
    let that = this;
    app.post({
      url: 'stalls/address/list',
      method:"post",
      data: { },
    })
      .then((res) => {
        console.log(res)
        that.setData({
          addressList: res.data
        })
      })

  },
  editAddress(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/users/address/edit/edit?id="+id,
    })
  },
  selectedAddress(e){
    let address = e.currentTarget.dataset.address;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      address,
    })
    wx.navigateBack({
      delta: 1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})