// otherpages/protocol/protocol.js
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  // 用户隐私政策                      
  goPrivacy(e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/users/privacy/privacy',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
    let openId = wx.getStorageSync("openid");
    let nickName = wx.getStorageSync("nickName");
    return {
      title: nickName + '邀您免费观影，推荐拿奖金。推荐多多，奖金多多。',
      path: '/pages/index/index?recommendCode=' + openId,
      imageUrl: "/image/share.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }

})