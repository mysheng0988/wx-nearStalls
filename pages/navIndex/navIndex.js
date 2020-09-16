let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classCode:"",
    label:"",
    TabCur: 0,
    scrollLeft: 0,
    tabNav:["服装鞋帽","日用百货","家具家装","生活服务","手机数码","餐饮美食","酒水副食"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let classCode=options.id;
    let label=options.label;
      this.setData({
        classCode,
        label,
      })
      this.getNavData();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 80
    })
  },
  tabSelect2(e){
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  getNavData(){
    let that=this;
    let code=this.data.classCode;
    app.post({
      url: 'office/classify/listOne',
      data: {
       code,
      },
    })
      .then((res) => {
       
        if (res.code==0){
          console.log(res)
          let tabNav = res.data
          that.setData({
            tabNav,
          })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})