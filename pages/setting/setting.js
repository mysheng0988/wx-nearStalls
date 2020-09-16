// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
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

  },
  
  switchToItem(e){
    let type=e.currentTarget.dataset.item;
    switch(type){
      case "agree":
        wx.navigateTo({
          url: '/pages/users/protocol/protocol',
        })
        break;
      case "address":
        wx.navigateTo({
          url: '/pages/users/address/addressList',
        })
        break;
      case "advise":
        wx.navigateTo({
          url: '/pages/users/appeal/appeal',
        })
        break;
      case "account":
        wx.navigateTo({
          url: '/pages/users/account/userAccount',
        })
        break;
    }

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