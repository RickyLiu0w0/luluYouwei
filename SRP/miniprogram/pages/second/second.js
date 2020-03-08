const app = getApp()
const {textData} = require('../first/first.js')

console.log("textData:",textData)
// textData = [{ "person": 0, "text": "中文0" },
// { "person": 1, "text": "中文1" },
// { "person": 1, "text": "中文2" },
// { "person": 0, "text": "中文3" },
// { "person": 1, "text": "中文4" },
// { "person": 0, "text": "中文5" },
// { "person": 0, "text": "中文6" }];


function translate(textData){
  var text="";
  //console.log("textData.length:", textData.length);
  console.log("textData:", textData)
  for (var i=0;i<textData.length;i++) {
    console.log("i:",i)
    console.log("text:",text)
    text += textData[i]["person"] + " : " + textData[i]["text"]+'\n';
  }
  
  // for (var i of textData) {
  //   console.log("i:", i)
  //   console.log("text:", text)
  //   text += textData[i]["person"] + " : " + textData[i]["text"] + '\n';
  // }



  return text;
}



Page({
  data:{
    textValue: translate(textData),
  },

  update:function(e){
    console.log("输出e.detail.value：", e.detail.value)
    this.setData({
      textValue: e.detail.value
    })
  },
  //一键复制
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: this.data.textValue,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
        console.log("复制成功!")
      }
    });
  }
  
  




})






