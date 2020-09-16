let app = getApp();
Component({
  /**
   * 组件的属性列表
   *  0 显示位置信息 1显示商品状态 2显示按钮
   */
  properties: {
    type:{
      type:Number,
      value:0,
    },
     goodsList:{
       type:Array,
       value:[]
     }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancelFollowGoods(e){
      let goodsId = e.currentTarget.dataset.id;
      app.post({
        url:"stalls/follow/delete/goodsId/"+goodsId,
        methods:"get",
        data:{}
      }).then(res=>{
          if(res.code==0){
            this.triggerEvent('dataFun')
          }
      })

    },
    goodsDetail(e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/goods/goodsDetail?goodsId=' + id,
      })
    },
  }
})
