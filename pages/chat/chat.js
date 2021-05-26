
let { w_get, w_post } = require('../../utils/request')
let data = require('../../lib/data')
let time = new Date();
// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],
    msg: null,
    image: 'https://ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D450%2C600/sign=a587b23df11f3a295a9dddcaac159007/500fd9f9d72a60590cfef2f92934349b023bba62.jpg',
    inputBottom: 0,
    time: ''
  },


  msg: '',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      msgList: data.msgList
    })
  },

  bindMsg(e) {
    this.msg = e.detail.value
    this.setData({
      msg: this.msg
    })
  },

  focusTextarea(e) {
    this.setData({
      inputBottom: e.detail.height
    })
    this.pageScrollToBottom() //滚到底部
  },
  blurTextarea(e) {
    this.setData({
      inputBottom: 0
    })
    this.pageScrollToBottom() //滚到底部
  },

  sendMsg() {
    let that = this
    if (that.data.msg != null && that.data.msg != "") {
      let msg = {
        content: that.data.msg,
        is: true,
        image: that.data.image
      }

      data.addMsg(msg)
      that.onLoad()
      that.setData({
        msg: ''
      })

      w_get(
        // "http://api.qingyunke.com/api.php",
        "http://192.168.2.2:3000/api/send",
        {
          key: "free",
          appid: "0",
          msg: that.msg
        },
        res => {
          let msg = {
            content: res.data.content.replace(/{br}/g, "<br>"),
            is: false,
            image: "../../image/img.jpg"
          }
          data.addMsg(msg)
          that.onLoad()
          this.pageScrollToBottom()
        },
        res => {
          console.log("错误", res);
          wx.showToast({
            title: '发送错误'
          });
        }
      )
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let hours = time.getHours() > 10 ? time.getHours() : '0' + time.getHours()
    let minutes = time.getMinutes() > 10 ? time.getMinutes() : '0' + time.getMinutes()

    that.setData({
      time: hours + ":" + minutes
    })
    wx.getUserProfile({
      success: (result) => {
        console.log(result);
        that.setData({
          image: result.rawData.avatarUrl
        })
      },
      fail: () => { },
      complete: () => { }
    });
    this.pageScrollToBottom() //滚到底部
  },


  pageScrollToBottom() {
    wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.height,
      });
    }).exec()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})