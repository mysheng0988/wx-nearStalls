let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:"",
    pageNum:1,
    pageSize:10,
    goodsList:[],
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
  setKeyword(e){
    let keyword= e.detail.value;
    this.setData({
      keyword,
    })
  },
  getSearchData(){
    this.setData({
      goodsList:[]
    })
     this.getGoodList(1,10)
  },
  getGoodList(pageNum,pageSize) {
    let that = this;
    let longitude=wx.getStorageSync('longitude')
    let latitude=wx.getStorageSync('latitude')
    let keyword=this.data.keyword;
    return app.post({
      url: 'stalls/goods/list',
      method:"post",
      data: {
        keyword,
        longitude,
        latitude,
        pageNum,
        pageSize,
      },
    })
      .then((res) => {
        if(res.code==0){
          let goodsList=[...this.data.goodsList,...res.data.items]
          that.setData({
            goodsList: goodsList,
            pageNum:res.data.currentPage
          })
        }else if(res.code==601&&this.data.goodsList.length>0){
            app.toast("没有更多数据了")
        }else{
          app.toast(res.msg)
        }
       return res;
      })

  },

  onPullDownRefresh(){
    let pageNum=1;
    let pageSize=10;
    this.setData({
      goodsList:[],
       pageNum,
       pageSize,
    })
    this.getGoodList(pageNum,pageSize).then(res=>{
      wx.stopPullDownRefresh()
    });
   },
   onReachBottom(){
    let pageNum=this.data.pageNum;
    pageNum++;
    let pageSize=this.data.pageSize;
      this.getGoodList(pageNum,pageSize);
   },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})