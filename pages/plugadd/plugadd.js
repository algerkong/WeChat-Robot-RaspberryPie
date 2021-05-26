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
      { op: "getalllist" },
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


  stateTap(e) {

    let state = e.currentTarget.dataset.state
    let name = e.currentTarget.dataset.name
    let that = this

    if (state == '一键安装') {
      wx.showModal({
        title: '你确定要安装' + name + '吗',
        success(res) {
          if (res.confirm) {
            w_get(
              that.data.url + '/api/plugin_update.py',
              {
                op: 'install',
                name: name
              },
              res => {
                console.log('安装插件成功', res);
                wx.showToast({
                  title: '安装 ' + name + ' 成功',
                  icon:'none'
                });

                that.onShow()

              },
              res => {
                console.log('安装插件错误', res);
                wx.showToast({
                  title: '安装错误,请重试'
                });
              }
            )
          }
        }
      })
    } else if (state == '一键升级') {
      wx.showModal({
        title: '你确定要升级' + name + '吗',
        success(res) {
          if (res.confirm) {
            w_get(
              that.data.url + '/api/plugin_update.py',
              {
                op: 'update',
                name: name
              },
              res => {
                console.log('升级插件成功', res);
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                });

              },
              res => {
                console.log('升级插件错误', res);
                wx.showToast({
                  title: '升级错误,请重试'
                });
              }
            )
          }
        }
      })
    }
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