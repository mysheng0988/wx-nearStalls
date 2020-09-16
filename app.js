//app.js
let config = require('./config.js')
let amapFile = require('./utils/amap-wx.js')
//const webSocket = require('utils/webSocket.js');
let num = 0;
App({

  onLaunch: function () {
   
    let that=this;
    wx.getSystemInfo({
      success: e => {
        that.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        that.globalData.Custom = custom;
        let CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        if (CustomBar<60){
          CustomBar=78;
        }
        that.globalData.CustomBar = CustomBar ;
      }
    })
    that.getLocation();
    this.authorize();
    this.versionUpdate();
  },
  // 提示信息
  prompt: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: "确定"
    })
  },

  // 授权获取地理位置
  getLocation(isNew = false) {
    return new Promise((resolve, reject) => {
      if (!isNew && this.globalData.location.latitude) {
        resolve(this.globalData.location);
        return;
      }
      this.getProvinceBmap()
    })
  },

  // 获取地图信息加载城市列表
  getProvinceBmap(e) {
    var that = this;
    // 新建百度地图对象 
    var amap = new amapFile.AMapWX({ key: '2b80ca09ea87ea1d9bf5719f76ee93fa' })
    amap.getRegeo({
      success: function (res) {
        console.log(res)
        let data =res[0];
        let regeocodeData = data.regeocodeData;
          that.globalData.location = {
            latitude: data.latitude,
            longitude: data.longitude,
          }
          wx.setStorageSync("latitude", data.latitude)
          wx.setStorageSync("longitude", data.longitude)
          wx.setStorageSync('location', data.name)
          that.globalData.address = {
            province: regeocodeData.addressComponent.province, // 获取省份
            city: regeocodeData.addressComponent.district //获取城市
          };
        wx.setStorageSync("city", regeocodeData.addressComponent.district)
          // that.brocast({
          //   path: "pages/index/index",
          //   method: "getCinemaData"
          // })
        },
      fail: function (res) {
        let latitude = wx.getStorageSync("latitude");
        let longitude = wx.getStorageSync("longitude");
        let city = wx.getStorageSync("city");
        that.globalData.location = {
          latitude: latitude,
          longitude: longitude,
        }
        that.globalData.city = city;
      }
    });
  },
  //检查版本更新
  versionUpdate() {
    wx.getUpdateManager().onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("是否有新版本：" + res.hasUpdate);
      if (res.hasUpdate) {//如果有新版本
        //wx.getUpdateManager().applyUpdate();
        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateReady(function () {//当新版本下载完成，会进行回调
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，单击确定重启应用',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                wx.getUpdateManager().applyUpdate();
              }
            }
          })

        })

        // 小程序有新版本，会主动触发下载操作（无需开发者触发）
        wx.getUpdateManager().onUpdateFailed(function () {//当新版本下载失败，会进行回调
          wx.showModal({
            title: '提示',
            content: '检查到有新版本，但下载失败，请检查网络设置',
            showCancel: false,
          })
        })
      }
    });
  },


  // 封装POST方法
  post(option = {
    headers: {},
    method:"post",
    url: ""
  }) {
    let self = this;
    let token = self.globalData.token;
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: '数据加载中...',
      })
      wx.request({
        url: option.url.indexOf("http") > -1 ? option.url : config.domain + option.url,
        header: Object.assign({
          "content-Type": config.contentType,
          "token": token
        }, option.headers),
        method: option.method,
        data: JSON.stringify(option.data),
        complete(res) {
          wx.hideLoading();
          switch (res.statusCode) {
            case 200:
              switch (res.data.code) {
                case 205:
                case 206:
                  wx.redirectTo({
                    url: '/pages/phone/phone',
                  });
                  reject({
                    code: '205'
                  })
                  break;
              }
              resolve(res.data);
              break;
            case 404:
              self.toast("访问数据不存在");
              reject({
                code: 404
              })
              break;
            case 500:
              self.toast("服务器错误");
              reject({
                code: 500
              })
              break;
            default:
              self.toast("网络或服务器错误~")
              reject({
                code: 500
              })
          }
        }
      })
    })
  },
  // toast方法
  toast(msg = "") {
    wx.showToast({
      title: msg,
      icon: "none"
    })
  },
  //获取授权码，//检查是否有授权码
  authorize() {
    let that=this;
    return new Promise((resolve, reject) => {
      resolve();
      wx.login({
        success: ({
          code
        }) => {
          that.post({
            url: "stalls/user/info/"+code,
            method:"get",
            data:{}
          })
            .then((res) => {
              console.log(res)
              if (res.code == "0" && res.data) {
                var openId = res.data.openId;
                that.globalData.token = res.data.token;
                that.globalData.userId = res.data.userId;
                that.globalData.nickName=res.data.nickName;
                that.globalData.phone=res.data.phone;
                that.globalData.avatar=res.data.avatar;
              }else{
                wx.setStorageSync("openId", "")
              }
             
            })
           
        },
        fail: () => {
          this.prompt("获取基本信息错误,请重新打开小程序");
          wx.reLaunch();
        }
      });
    })
  },
  //广播
  brocast({
    path = "",
    params = {},
    method = "receive"
  }) {
    let pages = getCurrentPages();
    //广播
    if (path == "") {
      pages.forEach(page => {
        if (typeof page[method] == 'function') {
          page[method](params);
        }
      })
      //单播
    } else {
      let cupage = pages.find(page => page.route == path);
      if (cupage && cupage[method]) {
        cupage[method](params);
      } else {
        console.warn(`单播页面[:${path}]没有找到或者没有[${method}]`);
      }
    }
  },

  // o2q
  o2q(o) {
    let r = [];
    Object.keys(o).forEach(key => {
      r.push(`${key}=${o[key]}`)
    })
    return r.join("&");
  },

  // 全局变量
  globalData: {
    openid: null,
    userId: "",
    username: "",
    avatar: '',
    goodsNum:null,
    location: {},
    address: {},
    domain: config.domain,
    imgPath: config.imgPath,
    wsmain: config.ws,
    city: '城市选择',
    area: '全城',
    token: ""
  },
})