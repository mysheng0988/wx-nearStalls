
let cropper = null;
let app=getApp();
Page({


  data: {
    path:""
  },


//////////////  init /////////////////////////
  onLoad: function (options) {

   this.setData({
     path:options.path,
   })

  },
  onReady(){
    cropper = this.selectComponent('#cropper');
    let path=this.data.path;
    cropper.fnInit({
      imagePath:path,       //*必填
      debug: false,                        //可选。是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
      outputFileType: 'jpg',              //可选。目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
      quality: 1,                         //可选。图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
      aspectRatio: 1,                  //可选。裁剪的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
      minBoxWidthRatio: 0.2,              //可选。最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
      minBoxHeightRatio: 0.2,             //可选。同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
      initialBoxWidthRatio: 0.6,          //可选。剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
      initialBoxHeightRatio: 0.6          //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
      });

  },

  ////////  cancel ///////////////////
  fnCancel:function(){
    wx.navigateBack({
      delta:1
    })
  },

////////// do crop ////////////////////
  fnSubmit:function(){
    console.log('submit')
    //do crop
    cropper.fnCrop({

      //剪裁成功的回调
      success:function(res){
        wx.showLoading({
          title: '图片上传中...',
        })
        wx.uploadFile({
          url: app.globalData.domain+'stalls/file/uploadImg', 
          filePath: res.tempFilePath,
          name: 'image',
          formData: {
            'user': 'test'
          },
          header:{
            token:app.globalData.token,
          },
          success(res1) {
           wx.hideLoading()
            if(res1.statusCode==200){
              const pages = getCurrentPages();//获取页面栈
              const beforePage = pages[pages.length - 2];  //前一个页面
              wx.navigateBack({ //跳转到前一个页面
                delta:1,//前一个页面
                success: function () {
                  //调用前一个页面的方法updateTime()。
                  let data=res1.data;
                   data=JSON.parse(data)
                  beforePage.ianageListData(data.data); 
                }
              })
            }else{
              app.toast("上传图片失败")
            }
           
          }
       })
       
    
      
      },
      fail:function(res){
      },
      complete:function(){
        //complete
      }
    });
  }
})