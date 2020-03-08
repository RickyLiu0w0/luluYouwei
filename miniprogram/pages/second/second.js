const app = getApp()
const getTextData = require('../first/first.js')
//var textData = getTextData().then(textData=>textData)


function translate(textData) {
  var text = "";
  console.log("textData:", textData)
  console.log("textData.length:", textData.length);

  for (var i = 0; i < textData.length; i++) {
    console.log("i:", i)
    console.log("text:", text)
    text += textData[i]["person"] + " : " + textData[i]["text"] + '\n';
  }
  return text;
}

Page({
  data: {
    textValue: "",
  },
  onLoad: function () {
    console.log("调用onload:")
    getTextData().then(textData => {
      console.log("textData：：：：：:", textData)
      this.setData({
        textValue: translate(textData)
      })
      //this.data.textValue = translate(textData)
    });
  },
  update: function (e) {
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
