let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    imgPath: app.globalData.imgPath,
    userMsg:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsId = options.goodsId;
    this.setData({
      goodsId,
    })
    this.getGoodsDetail(goodsId)
    
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    this.setData({
      amount: app.globalData.goodsNum,
    })
  },
  goShopCart(){
    wx.switchTab({
      url: '/pages/shopCart/shopCart',
    })
  },
  addShopCart(){
    let carts = wx.getStorageSync("carts");
    let shop = {
      shopId: "",
      shopName: "",
      shopSelected: true,
      data: {}
    }
    let goods = {
      goodsId: "",
      goodsName: "",
      goodsNorm: "",
      goodsNormId: "",
      goodsImage: "",
      price: 0,
      amount: 1,
      selected: true,
    }
    let shopMsg = this.data.shopMsg;
    let goodsMsg = this.data.goodsMsg;
    let goodsImg = this.data.goodsImg;
    let goodsNorms = this.data.goodsNorms;
    let goosdsNorm = goodsNorms[0].normsValue1 + goodsNorms[0].normsValue2;
    let goosdsNormId = goodsNorms[0].id;
    let price = goodsNorms[0].goodsPrice;
      if(carts==""){
        carts={};
        let shopModel = shop;
        shopModel.shopId = shopMsg.id;
        shopModel.shopName = shopMsg.shopName;
        carts[shopMsg.id] = shopModel;
        let goodsModel = goods;
        goodsModel.goodsId = goodsMsg.id;
        goodsModel.goodsNorm = goosdsNorm;
        goodsModel.goodsName = goodsMsg.goodsName;
        goodsModel.goodsImage = goodsImg[0].goodsImage;
        goodsModel.goodsNormId = goosdsNormId;
        goodsModel.price = price;
        carts[shopMsg.id].data[goodsMsg.id] = goodsModel;
      }else{
        console.log(goodsMsg.id)
        carts = JSON.parse(carts);
        if (carts[shopMsg.id]){
          if (carts[shopMsg.id].data[goodsMsg.id]){
            if (carts[shopMsg.id].data[goodsMsg.id].amount<5){
              carts[shopMsg.id].data[goodsMsg.id].amount = carts[shopMsg.id].data[goodsMsg.id].amount - 0 + 1;
            }else{
              app.toast("单个商品最多下五单")
              return;
            }
           
          }else{
            let goodsModel = goods;
            goodsModel.goodsId = goodsMsg.id;
            goodsModel.goodsNorm = goosdsNorm;
            goodsModel.goodsName = goodsMsg.goodsName;
            goodsModel.goodsImage = goodsImg[0].goodsImage;
            goodsModel.goodsNormId = goosdsNormId;
            goodsModel.price = price;
            carts[shopMsg.id].data[goodsMsg.id] = goodsModel;
          }

        }else{
          let shopModel = shop;
          shopModel.shopId = shopMsg.id;
          shopModel.shopName = shopMsg.shopName;
          carts[shopMsg.id] = shopModel;
          let goodsModel = goods;
          goodsModel.goodsId = goodsMsg.id;
          goodsModel.goodsNorm = goosdsNorm;
          goodsModel.goodsName = goodsMsg.goodsName;
          goodsModel.goodsImage = goodsImg[0].goodsImage;
          goodsModel.goodsNormId = goosdsNormId;
          goodsModel.price = price;
          carts[shopMsg.id].data[goodsMsg.id] = goodsModel;
        }
      }
      wx.setStorageSync("carts", JSON.stringify(carts))
      app.initGoodsNum();
    this.setData({
      amount: app.globalData.goodsNum,
    })
  },
  makeOrder(){
    app.toast("敬请期待")
  },
  comeTostalls(e){
    let userId=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/userIndex/userIndex?id='+userId,
    })
  },
  followUser(e){
    let that=this;
    let  userId=e.currentTarget.dataset.id;
    let userMsg=this.data.userMsg;
    app.post({
      url: 'stalls/follow/change/user/'+userId,
      method:"get",
      data: {},
    })
      .then((res) => {
        if(res.code==0){
          userMsg.isFollowUser=!userMsg.isFollowUser;
          let msg= userMsg.isFollowUser?"已关注":"取消关注"
          app.toast(msg)
          that.setData({
            userMsg,
          })
        }else{
          app.toast(res.msg)
        }
       
      })
  },
 
  followGoods(){
    let  goodsId=this.data.goodsModel.id;
    let goodsModel=this.data.goodsModel;
    let that=this;
    app.post({
      url: 'stalls/follow/change/goods/'+goodsId,
      method:"get",
      data: {
      },
    })
      .then((res) => {
        if(res.code==0){
          goodsModel.isFollowGoods=!goodsModel.isFollowGoods;
          let msg= goodsModel.isFollowGoods?"已收藏":"取消收藏"
          app.toast(msg)
         that.setData({
          goodsModel,
         })
        }else{
          app.toast(res.msg)
        }
       
      })
  },
  getGoodsDetail(goodsId) {
    let that = this;
    app.post({
      url: 'stalls/goods/goodsId/' + goodsId,
      data: {},
    })
      .then((res) => {
       if(res.code==0){
         let goodsModel = res.data;
        that.setData({
          goodsModel,
        })
         //resolve(res.data.goodsMsg.shopId);
         return res.data.userId;
       }
      }).then((res)=>{
        that.getUserMsgInfo(res)
      })

  },
  getUserMsgInfo(userId) {
    let that = this;
    let longitude=wx.getStorageSync('longitude')
    let latitude=wx.getStorageSync('latitude')
    app.post({
      url: 'stalls/user/userInfo/userId',
      method:"post",
      data: {
        longitude,
        latitude,
        userId
      },
    })
      .then((res) => {
        if(res.code==0){
          that.setData({
            userMsg: res.data,
          })
        }
      
      })
  },
  navigateToShop(e) {
    let that = this;
      // let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
      // let x = lng - 0.0065;
      // let y = lat - 0.006;
      // let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
      // let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
      // lng = z * Math.cos(theta);
      // lat = z * Math.sin(theta);

    let data = that.data.userMsg
    wx.openLocation({
      latitude: data.latitude,
      longitude: data.longitude,
      name: data.nikeName,
      address: data.location+data.address,

    })
  },
  callPhone(e){
    console.log(e)
    let phone=e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
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