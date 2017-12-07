//logs.js
const util = require('../../utils/util.js')
var config = require("../../config.js")
var app = getApp();
Page({
  data: {
    imgUrls: [
      '../../images/girl.jpeg',
      '../../images/girl2.jpeg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493698928333&di=99be91f1067ce820af8235607706813a&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F160412%2F9-160412091538.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1493698928333&di=ae56672831512cc7d4cd1e26d31269aa&imgtype=0&src=http%3A%2F%2Fimg.tupianzj.com%2Fuploads%2Fallimg%2F160412%2F9-160412091540.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    lists:{},
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
  image_longPress:function(e){
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
          }
        })
      },
      fail: function () {
        console.log('fail');
        wx.showToast({
          title: '图片保存失败了...',
          icon: 'success',
          duration: 2000
        })
      }  
    })
  },
  yue_func: function (event) {
    /*console.log("click!");
    wx.navigateTo({
      url: '../Detail/Detail'
    })*/
    var url = '../Detail/Detail?id=' + event.currentTarget.dataset.sno;
    console.log(url);
    wx.navigateTo({
      url: url,
      success: function (e) {
        //var page = getCurrentPages().pop();
        //if (page == undefined || page == null) return;
        //page.onLoad();
      }
    })
  },
  onLoad: function (options) {
      app.getUserinfo();
      console.log("asd");
      var that = this;
      wx.request({
        url: config.host + '/home',
        data: {},
        method: 'GET',
        header: {
          'Authorization': "JWT ",
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        success: function (res) {
          console.log(res);
          var lists = res.data;
          console.log(lists);
          that.setData({ lists: lists })
        }
      })
  }
})
