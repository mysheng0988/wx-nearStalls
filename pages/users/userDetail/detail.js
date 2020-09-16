let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageData: [],//页面显示图片地址
    uploadImage: [],//提交显示的地址
    id: "",
    userName: "",
    sex: 1,
    birthday: "",
    idCode: "",
    idCard: "",
    email: "",
    createDate: "",
    selected:false,
    imgPath: app.globalData.imgPath,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserDetailMsg();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  setBirthday(e) {
    let _this = this;
    var birthday = e.detail.value;
    _this.setData({
      birthday,
    })
  },
  setUserName(e){
    let _this = this;
    var userName = e.detail.value;
    _this.setData({
      userName
    })
  },
  setSexSelected(e){
    let _this = this;
    var selected = e.detail.value;
    let sex=this.data.sex;
    if (selected==false){
      sex=1
    }else{
      sex = 0
    }
    _this.setData({
      sex,
      selected,
    })
  },
  setIdCode(e){
    let _this = this;
    var idCode = e.detail.value;
    _this.setData({
      idCode
    })
  },
  setEmail(e){
    let _this = this;
    var email = e.detail.value;
    _this.setData({
      email
    })
  },
  updateUserDetailMsg() {
    let that = this;
    let id=this.data.id;
    let userName = this.data.userName;
    let sex = this.data.sex;
    let birthday = this.data.birthday;
    let idCode = this.data.idCode;
    let idCard = this.data.idCard;
    let email = this.data.email;
    app.post({
      url: 'office/userDetail/update',
      data: {
        id,
        userName,
        sex,
        birthday,
        idCode,
        idCard,
        email
      },
    })
      .then((res) => {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          app.toast(res.msg)
        }

      })
  },
  getUserDetailMsg(){
    let that=this;
    app.post({
      url: 'stalls/userDetail/userId',
      data: {},
    })
      .then((res) => {
        if (res.code == 0) {
          let selected = res.data.sex == "1" ? true:false;
         let imgPath = that.data.imgPath;
          let imageData = this.data.imageData;
          console.log(res.data.idCard != null )
          if (res.data.idCard != null &&res.data.idCard!=""){
            imageData = res.data.idCard.split(",");
            for (let i = 0; i < imageData.length; i++) {
              imageData[i] = imgPath + imageData[i];
            }
          }
         
          that.setData({
            id: res.data.id,
            userName: res.data.userName,
            sex: res.data.sex,
            birthday: res.data.birthday,
            idCode: res.data.idCode,
            idCard: res.data.idCard,
            email: res.data.email,
            createDate: res.data.createDate,
            imageData,
            selected,
          })
         
        }else{
          app.toast(res.msg)
        }
       
      })
  },
  updataFileData() {
    let that = this;
    let imageData = this.data.imageData;
    let uploadImage = this.data.uploadImage;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ["compressed"],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        imageData.push(tempFilePaths);
        that.setData({
          imageData: imageData,
        })
        wx.uploadFile({
          url: 'https://www.chudshop.com/office/file/fileUpload',
          filePath: tempFilePaths[0],
          name: 'file',
          header:{
            token: app.globalData.token
          },
          formData: {
            token: app.globalData.token
          },
          success(res) {
            console.log(res)
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
  removeImage(e) {
    let that = this;
    let imageData = that.data.imageData;
    let uploadImage = that.data.uploadImage;
    let index = e.currentTarget.dataset.index;
    let imgStr = uploadImage[index];
    app.post({
      url: 'office/file/delete',
      data: {},
    }).then((res)=>{
      if(res.code==0){
        imageData.splice(index, 1);
        uploadImage.splice(index, 1);
        that.setData({
          imageData: imageData,
          uploadImage: uploadImage
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