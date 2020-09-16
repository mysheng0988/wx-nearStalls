let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    address: ['北京市', '北京市', '海淀区'],
    userName: "",
    phone: "",
    addressDetail: "",
    label:"",
    selected:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let id = options.id;
    if (id!=""&&id!=undefined){
      this.setData({
        id,
      })
      this.getAddressDetail(id);
    }

  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {

  },
  regionChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  phoneNum(e) {
    let _this = this;
    var phone = e.detail.value;
    _this.setData({
      phone: phone,
    })
  },
  getUserName(e){
    let _this = this;
    var userName = e.detail.value;
    _this.setData({
      userName,
    })
  },
  getAddressSelected(e){
    let _this = this;
    var selected = e.detail.value;
    _this.setData({
      selected,
    })
  },
  setAddressDetail(e) {
    let _this = this;
    var addressDetail = e.detail.value;
    _this.setData({
      addressDetail,
    })
  },
  getLabel(e) {
    let _this = this;
    var label = e.detail.value;
    _this.setData({
      label,
    })
  },
  getAddressDetail(id){
    let that=this;
    app.post({
      url: 'stalls/address/address/'+id,
      data: { },
    })
      .then((res) => {
        if (res.code == 0) {
          console.log(res.code)
          that.setData({
            userName:res.data.userName,
            phone:res.data.phone,
            address: res.data.address.split(","),
            addressDetail:res.data.addressDetail,
            label: res.data.label,
            selected: res.data.selected,
          })
        }
      })

  },
  deleteAddress() {
    let that = this;
    let id=this.data.id;
    app.post({
      url: 'stalls/address/delete/' + id,
      method:"get",
      data: {},
    })
      .then((res) => {
        if (res.code == 0) {
          app.toast("删除成功")
          wx.navigateBack({
            delta: 1
          })
        }else{
          app.toast(res.msg)
        }
      })

  },
  saveAddress() {
    let that = this;
    let id = this.data.id;
    let userName = this.data.userName;
    let phone = this.data.phone;
    let address = this.data.address.join(",");
    let addressDetail = this.data.addressDetail;
    let label = this.data.label;
    let selected = this.data.selected;
    app.post({
      url: 'stalls/address/save',
      method:"post",
      data: {
        id,
        userName,
        phone,
        address,
        addressDetail,
        label,
        selected,
      },
    })
      .then((res) => {
        if(res.code==0){
          app.toast("保存成功")
          wx.navigateBack({
            delta: 1
          })
        } else {
          app.toast(res.msg)
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