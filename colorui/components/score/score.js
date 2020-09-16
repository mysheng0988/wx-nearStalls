Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rate: {
      type: String,
      value: '0',
      observer: function (rate) {
        // console.log(rate)
        // this.setData({
        //   rate: rate
        // })
        this.wxStarInit(rate);
      }
    },
    disabled: {
      type: Boolean,
      value: false
    },
    big: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  
  /**
   * 组件的方法列表
   */
  methods: {
      wxStarChange(e) {
        if(this.data.disabled) return;   // 只可展示，不可评星
        var dataset = e.currentTarget.dataset, idx = dataset.idx, index = dataset.index;
        var star = this.data.wxStar, len = star.length;
        console.log(len)
        for(var i = 0; i<len; i++) {
        if (i < idx) star[i] = [1, 1];
        else if (i == idx) {
          if (index == 0) star[i] = [1, 0];
          else star[i] = [1, 1];
        }
        else star[i] = [0, 0];
      }
      console.log(star)
      this.setData({
        wxStar: star,
      })
    }, 
    wxStarInit(count) {
      count = count != undefined ? parseInt(count, 10) : 10;
      var str = '';
      for (var i = 1; i <= 10; i++) {
        if (i <= count) str += '1,';
        else str += '0,';
      }
      var arr = str.split(',');
      this.setData({
        wxStar: [
          [arr[0], arr[1]],
          [arr[2], arr[3]],
          [arr[4], arr[5]],
          [arr[6], arr[7]],
          [arr[8], arr[9]],
        ]
      })
    },
  }
})
