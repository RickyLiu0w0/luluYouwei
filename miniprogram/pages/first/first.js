const rm = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
// var textData = [{ "person": 0, "text": "中文0" }, 
// { "person": 1, "text": "中文1" },
//   { "person": 1, "text": "中文2" },
//   { "person": 0, "text": "中文3" },
//   { "person": 1, "text": "中文4" },
//   { "person": 0, "text": "中文5" },
//   { "person": 0, "text": "中文6" }];
var textData;
var num = 0

function wxPromisify(functionName, params) {
  return new Promise((resolve, reject) => {
    wx[functionName]({
      ...params,
      success: res => resolve(res),
      fail: res => reject(res)
    });
  });
}

// 显示圈圈
function showLoading(params = {}) {
  return wxPromisify('showLoading', params);
}

// 上传文件
function uploadFile(params = {}) {
  return wxPromisify('uploadFile', params);
}

// 分析
function request(params = {}) {
  return wxPromisify('request', params);
}

// 关闭圈圈
function hideLoading(params = {}) {
  return wxPromisify('hideLoading', params);
}


rm.onStop(function (e) {
  showLoading({
    title: "正在识别..."
  }).then(res => {
    console.log('showLoading --->', res);
    return uploadFile({
      url: "http://47.100.56.186/upload",
      filePath: e.tempFilePath,
      name: "record",
      header: {
        "Content-Type": "multipart/form-data"
      }
    });
  }).then(res => {
    console.log('uploadFile --->', res);
    var result = JSON.parse(res.data);
    var filename = filename = result['token'];
    return request({
      url: 'http://47.100.56.186:80/recognize?K=' + num + '&f=' + filename,
      method: "GET"
    }
    );
  }).then(res => {
    console.log('request --->', res); // 识别结果在这里 res.data
    textData=res.data;


    return hideLoading();
  }).then(res => {
    console.log('文件识别完毕');
  }).catch(err => {
    console.log(err);
  });
}),
///////////////////////////////////////////////////////
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
    state: '长按录音',
    touchStart: 0,
    touchEnd: 0,
    resultData:"",
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
        }),
        console.log("n.animation2.export()", n.animation2.export())
        ));
        
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
}
)


//textData数据类型：[{ "person": 0, "text": "中文" }]


module.exports =  {textData}