const app = getApp()



Page({
  data:{
    textValue:"",
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
        console.log("fuzhichenggong!")
      }
    });
  },
  // //左上角一键返回
  // returnPage:function(){
  //   wx.navigateTo({
  //     url: '../first/first'
  //   })
  // }
  




})






