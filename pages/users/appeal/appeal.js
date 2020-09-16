let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"",
    fontNum:0,
    imageData:[],
    uploadImage:[],
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
  setContext(e){
    let _this = this;
    var content = e.detail.value;
    _this.setData({
      fontNum: content.length,
      content: content,
    })
  },
  updataFileData(){
    let that=this;
    let imageData=this.data.imageData;
    let uploadImage=this.data.uploadImage;
    wx.chooseImage({
      count:1,
      sourceType: ['album', 'camera'],
      sizeType: ["compressed"],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        imageData.push(tempFilePaths);
        that.setData({
          imageData: imageData,
        })
        wx.uploadFile({
          url: 'https://manage.hiiying.com/api/upload/uploadSingle', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            let data = res.data;
            data = JSON.parse(data);
            uploadImage.push(data.data);
            that.setData({
              uploadImage: uploadImage,
            })
          }
        })
      }
    })
  },
  removeImage(e){
    let that=this;
    let imageData =that.data.imageData;
    let uploadImage = that.data.uploadImage;
    let index = e.currentTarget.dataset.index;
    imageData.splice(index, 1);
    uploadImage.splice(index, 1);
    that.setData({
      imageData: imageData,
      uploadImage: uploadImage
    })
  },
  submit(){
    let manage = app.globalData.manage;
    let uploadImage = this.data.uploadImage;
    if (uploadImage.length==0){
      app.toast("请上传图片")
      return
    }
    let files = uploadImage.join(",");
    let content = this.data.content
    if (content==''){
      app.toast("请输入申诉内容！")
      return
    }
    // wx.request({
    //   url: manage +'api/appeal/submitAppeal',
    //   method: "POST",
    //   data: JSON.stringify({
    //     files: files,
    //     content: content,
    //   }),
    //   header: {
    //     'authorizationCode': app.globalData.Authorization,
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     if (res.data.code==0){
    //       wx.showModal({
    //         title: '申诉成功',
    //         content: res.data.data,
    //         showCancel: false,
    //         confirmText: '我知道了',
    //         success: function (res) {
    //           wx.navigateBack({
    //             data:1
    //           })
    //         }
    //       })
    //     }else{
    //       app.toast(res.data.message)
    //     }
    //   }
    // })
    app.postManage({
      url: 'api/appeal/submitAppeal',
      data: {
        files: files,
        content: content,
      },
    })
      .then((res) => {
        console.log(res)
        if (res.code == 0) {
          wx.showModal({
            title: '申诉成功',
            content: res.data,
            showCancel: false,
            confirmText: '我知道了',
            success: function (res) {
              wx.navigateBack({
                data:1
              })
            }
          })
        }else{
          app.toast(res.message)
        }
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})