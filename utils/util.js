const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function animationMiddleHeaderItem(that) {
  var circleCount = 0;
  // 心跳的外框动画  
  that.animationMiddleHeaderItem = wx.createAnimation({
    duration: 1000,    // 以毫秒为单位  
    timingFunction: 'linear',
    delay: 100,
    transformOrigin: '50% 50%',
    success: function (res) {
    }
  });
  setInterval(function () {
    if (circleCount % 2 == 0) {
      that.animationMiddleHeaderItem.scale(1.3).step();
    } else {
      that.animationMiddleHeaderItem.scale(1.0).step();
    }

    that.setData({
      animationMiddleHeaderItem: that.animationMiddleHeaderItem.export()  //输出动画
    });

    circleCount++;
    if (circleCount == 1000) {
      circleCount = 0;
    }
  }.bind(this), 1000);
  return that.animationMiddleHeaderItem;
}
function removeArray(_arr, _obj) {
  let length = _arr.length;
  for (let i = 0; i < length; i++) {
    if (_arr[i] === _obj) {
      if (i === 0) {
        _arr.shift(); //删除并返回数组的第一个元素
        return _arr;
      }
      else if (i === length - 1) {
        _arr.pop();  //删除并返回数组的最后一个元素
        return _arr;
      }
      else {
        _arr.splice(i, 1); //删除下标为i的元素
        return _arr;
      }
    }
  }
}
var faces = function () {
  var alt = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"], arr = {};
  for(let i=0;i<alt.length;i++){
    arr[alt[i]]=i+".gif";
  }
  return arr;
}
module.exports = {
  faces:faces,
  formatTime: formatTime,
  removeArray: removeArray,
  animationMiddleHeaderItem: animationMiddleHeaderItem,//心跳动画
}
