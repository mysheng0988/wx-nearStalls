// colorui/components/emoji/emoji.js
let faces = require('../../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   chat:{
    type: String,
    value: '',
    observer: function (str) {
      let strList = [];
      if (str.indexOf("[")!=-1){
        let emo =this.faceRep(str);
        console.log(emo)
        var res = new Array(), tmp = '';

        for (var i = 0, len = emo.length; i < len; i++) {
        
          if (tmp == '' && emo[i] != '[') {
            var param = {};
            param.type="text";
            param.content = emo[i];
            res.push(param);
          } else if (emo[i] == '[') {
            tmp += '[';
          } else if (tmp) {
            var param = {};
            tmp += emo[i];
            if (emo[i] == ']') {
              var param = {};
              param.type="emo";
              console.log(tmp)
              param.content = faces.faces()[tmp];
              res.push(param);
              tmp = '';
            }
          }
        }
        strList=res;

      }else{
        var param={};
        param.type="text";
        param.content = str;
        strList.push(param);
      }
      console.log(strList)
      this.setData({
        strList,
      })
    }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    strList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
     faceRep( value){
       return value.replace(/face\[/g, "[");
     }
  }
})
