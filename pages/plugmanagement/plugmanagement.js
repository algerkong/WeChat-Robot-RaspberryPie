let { w_get, w_post } = require('../../utils/request')

// pages/plugmanagement/plugmanagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    plugs: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      url: options.url
    })
  },

  plugTap(e) {
    wx.navigateTo({
      url: '/pages/plugitemset/plugitemset?url=' + this.data.url + '&name=' + e.currentTarget.dataset.name
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setData({
      url: this.data.url
    })
    wx.showLoading({
      title: '加载中...'
    });
    w_get(
      that.data.url + "/api/plugin_list.py",
      { op: "getlist" },
      res => {
        that.setData({
          plugs: res.data.data
        })

        wx.hideLoading();
      },
      res => {
        console.log(res);
      }
    )
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