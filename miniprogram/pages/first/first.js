const rm = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()

var num = 0
rm.onStop(function (e) {
  var filename = '' // 返回文件名称
  var a = this;
  wx.showLoading({
    title: "正在识别..."
  });

  //上传逻辑
  var n = {
    url: "http://47.100.56.186/upload",
    filePath: e.tempFilePath,
    name: "record",
    header: {
      "Content-Type": "multipart/form-data"
    },
    success: function (res) {
      console.log("上传成功！")
      var result = JSON.parse(res.data);
      filename = result['token'];
      console.log(result)
      // 语音转换
      wx.request({
        url: 'http://47.100.56.186:80/recognize?K=' + num + '&f=' + filename,
        method: "GET",
        success: function (res) {
          console.log(res)
        },

        fail: function (res) {
          console.log("error")
        }
      })
    },

    fail: function (err) {
      var result = JSON.parse(err.data);
      console(result)
    }
  };
  wx.uploadFile(n);


}),
Page({
  data: {
    /**
     * 页面的初始数据
     */
    //普通选择器：（普通数组）
    array: [0, 1, 2, 3,4,5,6,7,8,9,10],
    index: 0,
    //开始录音按钮
    hasRecord: false,
    isDot: "block",
    isTouchStart: false,
    isTouchEnd: false,
    state: '开始录音',
    touchStart: 0,
    touchEnd: 0

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value),
    num=e.detail.value,
    this.setData({
      index: e.detail.value
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    var a = this;
    wx.authorize({
      scope: "scope.record",
      success: function () {
        console.log("录音授权成功");
      },
      fail: function () {
        console.log("录音授权失败");
      }
    }), a.onShow()

  },
  // 点击录音按钮
  onRecordClick: function () {
    wx.getSetting({
      success: function (t) {
        console.log(t.authSetting), t.authSetting["scope.record"] ? console.log("已授权录音") : (console.log("未授权录音"),
          wx.openSetting({
            success: function (t) {
              console.log(t.authSetting);
            }
          }));
      }
    });
  },
  /**
   * 长按录音开始
   */
  recordStart: function (e) {
    if(this.data.index<=0){
      wx.showToast({
        title: '请选择说话人数',
        icon:"none",
        duration:1000,
      });
    }else{
    var n = this;
    this.setData({
      state: "录音中"
    }),
    rm.start({
      format: "mp3",
      sampleRate: 32e3,
      encodeBitRate: 192e3
    }), 
    n.setData({
      touchStart: e.timeStamp,
      isTouchStart: true,
      isTouchEnd: false,
      showPg: true,
    })
    var a = 59, o = 10;
    this.timer = setInterval(function () {
      n.setData({
        value: n.data.value - 100 / 1500
      }), (o += 10) >= 1e3 && o % 1e3 == 0 && (a-- , console.log(a), a <= 0 && (rm.stop(),
        clearInterval(n.timer), n.animation2.scale(1, 1).step(), n.setData({
          //输出文件
          animationData: n.animation2.export(),
          showPg: false,
        })));
        //console.log("输出文件：",animationData)
    }, 10);
  }
  },
  /**
   * 长按录音结束
   */
  recordTerm: function (e) {
    if (this.data.index > 0){

    
    rm.stop(), this.setData({
      isTouchEnd: true,
      isTouchStart: false,
      touchEnd: e.timeStamp,
      showPg: false,
      value: 100
    }), clearInterval(this.timer);
    wx.navigateTo({
      url: '../second/second',
    })
    this.setData({
      state: "开始录音"
    })
    }
  },
})