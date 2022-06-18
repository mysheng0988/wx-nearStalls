let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auditList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id:options.id,
      })
    }
    this.getAuditDetail(options.id);
 },
 getAuditDetail(id){
   app.post({
     url:'stalls/banner/record/list/'+id,
     method:"get",
     data:{},
   }).then(res=>{
     if(res.code==0){
       this.setData({
         auditList:res.data
       })
     }else{
       app.toast(res.msg)
     }
   })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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