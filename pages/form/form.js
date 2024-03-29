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
    duration: 1000,
    money_need:0,
    wage:1,
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
  order_func: function (event) {
    console.log("click!");
    //wx.navigateTo({
    //  url: '../form/form'
    //})
  },
  hour_bind_input:function(e){
    var w = this.data.wage
    this.setData({
      hour: e.detail.value,
      money_need: e.detail.value * w
    })
    console.log(e.detail.value)
    console.log(this.data.money_need)
  },
  note_bind_input: function (e) {
    this.setData({
      note: e.detail.value
    })
    console.log(e.detail.value)
  },
  onLoad: function (options) {
    var sno = options.id;
    this.setData({
      sno: sno
    })
    console.log(sno);
    var that = this;
    wx.request({
      url: config.host + '/form',
      data: {sno:sno},
      method: 'GET',
      header: {
        'Authorization': "JWT ",
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      success: function (res) {
        console.log(res);
        var lists = res.data;

        //console.log(lists);
        that.setData({ wage: lists[0].swage })
      }
    })
  },
  order_func:function(){
    var that = this;
    if(that.data.hour){
      //console.log(res);
      wx.request({
        url: config.host + '/pay',
        header: {
          'Authorization': "JWT ",
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: { bno: wx.getStorageSync('openid'), hour: that.data.hour * 10, note: that.data.note,  sno: that.data.sno, need: that.data.money_need*100},
        method: 'GET',
        success: function (res) {
          console.log({ bno: wx.getStorageSync('openid'), hour: that.data.hour * 10, note: that.data.note, sno: that.data.sno, need: that.data.money_need });
          if(res.data.my_status == 2){
            wx.showToast({
              title: '您已经约过了~',
              icon: 'success',
              duration: 2000
            })
            return ;
          }
          if(res.data.my_status ==0){
            wx.showToast({
              title: '失败',
              icon: 'success',
              duration: 2000
            })
            return ;
          }
          console.log(res);
          console.log("before rp");
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            'success': function (res) {
              console.log("rp success");
              console.log(res);
              wx.showToast({
                title: '成功，3秒后跳转',
                icon: 'success',
                duration: 2000
              });
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/Order/Order',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                      page.onLoad();
                  }
                }) //要延时执行的代码  
              }, 3000)
            },
            'fail': function (res) {
              console.log(res)
            }
          })
        }
      })
          /*
          else if(res.data.status == 2){
            wx.showToast({
              title: '您已经约过了~',
              icon: 'success',
              duration: 2000
            })
          }
          else{
            wx.showToast({
              title: '失败',
              icon: 'success',
              duration: 2000
            })
          }*/
          //var lists = res.data;
          //console.log(lists);
          //that.setData({ lists: lists })
    }
    else{
      wx.showToast({
        title: '输入时间哦',
        icon: 'loading',
        duration: 2000
      })
    }
  }
})
