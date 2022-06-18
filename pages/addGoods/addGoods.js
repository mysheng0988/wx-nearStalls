let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsName:"",
    goodsType:"SHFW695802",
    index:0,
    goodsDescribe:"",
    picker:[],
    goodsImages:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.initData(options)
     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  async initData(options){
    await this.getClassData();
    if(options.goodsId){
      this.setData({
        goodsId:options.goodsId
      })
      this.getGoodsDetail(options.goodsId)
    }
  },
  getGoodsDetail(goodsId) {
    let that = this;
    let picker=this.data.picker;
    app.post({
      url: 'stalls/goods/goodsId/' + goodsId,
      data: {},
    })
      .then((res) => {
       if(res.code==0){
         let goodsModel = res.data;
        console.log(picker)
         let index=0;
        for(let i=0;i<picker.length;i++){
            if(goodsModel.goodsType==picker[i].classCode){
              index=i;
            }
        }
        that.setData({
          goodsName:goodsModel.goodsName,
          goodsType:goodsModel.goodsType,
          goodsDescribe:goodsModel.goodsDescribe,
          price:goodsModel.price,
          index,
          goodsImages:goodsModel.goodsImages,
        })
       }
      })

  },
   getClassData(){
   return app.post({
      url: 'stalls/class/list',
      method:"post",
      data: {},
    })
      .then((res) => {
        if(res.code==0){
          this.setData({
            picker: res.data
          })
        }
      })
  },
  setPrice(e){
    let _this = this;
    var price = e.detail.value;
    _this.setData({
      price,
    })
  },
  setGoodsDescribe(e){
    let _this = this;
    var goodsDescribe = e.detail.value;
    _this.setData({
      goodsDescribe,
    })
  },
  setGoodsName(e){
    let _this = this;
    var goodsName = e.detail.value;
    _this.setData({
      goodsName,
    })
  },
  pickerChange(e) {
    let index= e.detail.value;
    this.setData({
      index,
      goodsType: this.data.picker[index].classCode
    })
  },
  previewGoodsImages(e){
    let path=e.currentTarget.dataset.path;
    let goodsImages=this.data.goodsImages;
    let urls=[];
    for(let item of goodsImages){
      urls.push(item.imagePath)
    }
     wx.previewImage({
          current:path,
          urls: urls,
      })
  },
  ianageListData(path){
    let goodsImages=this.data.goodsImages;
    let param={
      imagePath:path
    }
    goodsImages.push(param);
     this.setData({
          goodsImages,
     })
  },
  updataFileData(){
    wx.chooseImage({
      count:1,
      sourceType: ['album', 'camera'],
      sizeType: ["compressed"],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        wx.navigateTo({
          url: '/pages/cropper/cropper-example?path='+tempFilePaths,
        })
        // goodsImages.push(tempFilePaths);
        // that.setData({
        //   goodsImages: goodsImages,
        // })
        
      }
    })
  },
  removeImage(e){
    let that=this;
    let goodsImages =that.data.goodsImages;
    let index = e.currentTarget.dataset.index;
    let data=goodsImages[index];
    if(!data.id){
      app.post({
        url:"stalls/file/delete",
        method:"post",
        data:data
      }).then(res=>{
        if(res.code==0){
          goodsImages.splice(index, 1);
          that.setData({
            goodsImages: goodsImages,
          })
        }else{
          app.toast(res.msg)
        }
        
      })
    }

  },
  saveGoodsData(){
    let goodsImages=this.data.goodsImages;
    let goodsId=this.data.goodsId;
     let data={
       id:goodsId,
       goodsType:this.data.goodsType,
       price:this.data.price,
       goodsDescribe:this.data.goodsDescribe,
       goodsName:this.data.goodsName,
       goodsImages:goodsImages
     }
     app.post({
      url: 'stalls/goods/add',
      method:"post",
      data: data,
    })
      .then(res => {
        if(res.code==0){
          wx.navigateBack({ //跳转到前一个页面
            delta:1,//前一个页面
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