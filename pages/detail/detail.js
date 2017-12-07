
//logs.js
const util = require('../../utils/util.js')
var config = require("../../config.js")
var app = getApp()
Page({
  data: {
    imgUrls: [
      '../../images/girl2.jpeg',
      '../../images/girl.jpeg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493698928333&di=99be91f1067ce820af8235607706813a&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F160412%2F9-160412091538.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493698928333&di=ae56672831512cc7d4cd1e26d31269aa&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F160412%2F9-160412091540.jpg'
    ],
    indicatorDots: true,

    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  image_longPress: function (e) {
    console.log(e.currentTarget.dataset.src);
    wx.downloadFile({
      url: e.currentTarget.dataset.src,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res);
            wx.showToast({
              title: '图片保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {
            console.log(res);
            console.log('fail');
            wx.showToast({
              title: '图片保存失败了...',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function () {
        console.log('fail');
      }
    })
  },
  yue_ta_func: function (event) {
    console.log("click!");
    var url = '../Form/Form?id=' + event.currentTarget.dataset.sno;
    wx.navigateTo({
      url: url
    })
  },
  like_func:function(event){
    console.log("like!");
    var sno = event.currentTarget.dataset.sno;
    console.log({ sno: sno, bno: wx.getStorageSync('openid') });
    wx.request({
      url: config.host + '/like',
      data: { sno: sno, bno: wx.getStorageSync('openid') },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if(res.data.status == 1){
          console.log("success");
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../Detail/Detail?id='+sno,
            })
          },1000);
        }
        else if (res.data.status == 2){
          console.log("您已经赞过人家了~");
        }
        else{
          console.log("点赞失败了...")
        }
      }
    })
  },
  onLoad: function (options) {
    var sno = options.id;
    this.setData({id:sno});
    console.log(sno);
    var that = this;
    wx.request({
      url: config.host + '/detail',
      data: {sno:sno},
      method: 'GET',
      header: {
        'Authorization': "JWT ",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      success: function (res) {
        console.log(res);
        var list = res.data[0];
        console.log(list);
        that.setData({ list: list })
      }
    })
  }
})
