let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RadioType:1,
    phone:"",
    password:"123456",
    validateCode:"",
    phDisabled: false,
    verifyWord: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let phoneNumber = options.phone;
    if (phoneNumber){
      this.setData({
        phoneNumber: phoneNumber
      });
    }
   

  },
  // 同意协议
  agree(e) {
    var that = this;
    var RadioType = that.data.RadioType;
    if (RadioType == 1) {
      that.setData({
        RadioType: 0
      })
    } else {
      that.setData({
        RadioType: 1
      })
    }
  },
  
  // 获取输入手机号
  phoneNumber(e) {
    let _this = this;
    var phone = e.detail.value;
    _this.setData({
      phone: phone,
    })
  },
  // 点击授权
  bindGetUserInfo:function(e) {
    var that = this;
    var RadioType = that.data.RadioType
   
    if (RadioType==1) {
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var data = e.detail.userInfo;
        var nickName = data.nickName;
        var avatar = data.avatarUrl;
        var sex = data.gender;
        var city = app.globalData.address.city;
        var province = app.globalData.address.province;
        that.setData({
          nickName: nickName,
          avatar: avatar,
          sex: sex,
          city: city,
          province: province,
        })
        //获取短信验证码
        that.pverify();
       
      } else {
        //用户按了拒绝按钮
        wx.showModal({
          title: '提示',
          content: '拒绝授权将无法出票!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您未同意嗨影用户协议',
        showCancel: false
      })
    }
  },
  //用户登录
  loginUser(e){
    var that = this;
    var password = that.data.password;
    var phone = that.data.phone;
    var validateCode=that.data.validateCode;
    //用户按了允许授权按钮
    var data = e.detail.userInfo;
    console.log(data)
    var nickName = data.nickName;
    var avatar = data.avatarUrl;
    var sex = data.gender;
    var city = app.globalData.address.city;
    var province =app.globalData.address.province;
    let location=province+wx.getStorageSync('location');
    let longitude=wx.getStorageSync('longitude');
    let latitude=wx.getStorageSync('latitude')
    wx.showLoading({
      title: '加载中...',
    })
    wx.login({
      success(res) {
        if (res.code) {
          let code = res.code;
          app.post({
            url: 'stalls/user/regUser',
            method:"post",
            data: {
              code,
              validateCode,
              password,
              phone,
              avatar,
              nickName,
              sex,
              location,
              longitude,
              latitude,
              city,
              province
            },
          })
            .then((res) => {
              
              if(res.code==0){
                app.globalData.token = res.data.token;
                app.globalData.nickName=res.data.nickName;
                app.globalData.phone=res.data.phone;
                app.globalData.avatar=res.data.avatar;
                wx.navigateBack({
                  data:1
                })
                app.toast(res.msg);
              }else{
                app.toast(res.msg);
              }
            })
        }
      }
    })
  },

  // 获取验证码
  bindpassword(e) {
    let _this = this;
    var password = e.detail.value;
    _this.setData({
      password: password,
    })
  },
  securityCode(e){
    let _this = this;
    var validateCode = e.detail.value;
    _this.setData({
      validateCode,
    })
  },
  // 用户协议页面                       
  goProtocol(e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/users/protocol/protocol',
    })
  },
  //短信验证码
  pverify() {
    var that = this;
    var time = 0;
    var phoneNumber = that.data.phone;
    console.log(phoneNumber)
    var regMobile = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
    console.log(regMobile.test(phoneNumber))
    if (regMobile.test(phoneNumber)) {
      app.post({
        url: 'stalls/sms/message/' + phoneNumber,
        data: {},
      })
        .then((res) => {
          if (res.code == '0') {
            if (time == 0) {
              wx.showToast({
                title: '短信已发送',
                icon: 'success'
              })
              time = 60;
              that.setData({
                phDisabled: true,
                verifyWord: '60秒获取',
                validateCodeId: res.data
              })
              var task = setInterval(function () {
                time--;
                that.setData({
                  verifyWord: '' + time + "秒获取"
                })
                if (time == 0) {
                  clearInterval(task);
                  that.setData({
                    phDisabled: false,
                    verifyWord: '重新发送'
                  })
                }
              },
                1000)
            } else {
              app.prompt(res.msg);
            }
          } else {
            app.prompt(res.msg)
          }
        })
    } else {
      app.prompt("请输入正确的手机号")
    }
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