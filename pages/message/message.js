
let { w_get, w_post } = require('../../utils/request')
let data = require('../../lib/data')
let time = new Date();



var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()



// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: [],

    msg: null,
    image: '',
    inputBottom: 0,
    time: '',
    userInfo: {},
    isRecord: false,
    isRecordStart: false,
    recordText: "按住 说话"
  },


  msg: '',
  innerAudioContext: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    let that = this
    //音乐播放的方法
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.autoplay = true;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.setRecord()
    this.textToRecord()
  },
  tapMain() {
    this.setData({
      isRecord: false
    })
  },

  setRecord() {
    let that = this
    manager.onRecognize = function (res) {
      console.log("current result", res.result)
    }
    manager.onStop = function (res) {


      let record = {
        type: 'record',
        content: res.result,
        is: true,
        image: that.data.image,
        recordfile: res.tempFilePath,
        duration: res.duration,
      }
      console.log("录音结束", record)

      if (res.result != "") {
        data.addMsg(record)
        that.setMsgList()
        that.postMsg(res.result)
      } else {
        wx.showToast({
          title: '您没有讲话',
          icon: 'none',
        });
      }



      console.log(res.result);

    }
    manager.onStart = function (res) {
      console.log("成功开始录音识别", res)
    }
    manager.onError = function (res) {
      console.error("error msg", res.msg)
    }
  },

  setMsgList() {
    let that = this
    that.setData({
      msgList: data.msgList
    })
    this.pageScrollToBottom()
    console.log(this.data.msgList);
  },

  bindMsg(e) {
    this.msg = e.detail.value
    this.setData({
      msg: this.msg
    })
  },

  focusTextarea(e) {
    this.setData({
      isRecord: false,
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
  //文字转语音
  textToRecord(text) {
    let that = this
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: text,
      success: function (res) {
        console.log("succ tts", res.filename)

        let innerAudioContext = that.innerAudioContext
        innerAudioContext.src = res.filename;
        innerAudioContext.play()
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    })
  },

  //点击发送的方法
  sendMsg() {
    if (wx.getStorageSync("is_first") != 1) {
      this.getUserProfile()
      return
    }

    this.setData({
      isRecord: false
    })
    let that = this
    if (that.data.msg != null && that.data.msg != "") {
      let msg = {
        type: "msg",
        content: that.data.msg,
        is: true,
        image: that.data.image
      }

      data.addMsg(msg)
      that.setMsgList()
      that.setData({
        msg: ''
      })

      that.postMsg(that.msg)

    }
  },

  //请求货币对的方法
  getMoney(content) {
    w_get(
      "http://192.168.2.29:8008/tickmill_api/tick/" + content,
      {},
      res => {
        console.log(res.data.data);
        return res.data.data
      },
      res => {

      }
    )
  },


  //返回消息的方法
  postMsg(content) {
    let that = this

    try {
      w_get(
        "http://192.168.2.29:8008/tickmill_api/tick/" + content,
        {},
        res => {
          let moneyMsg = res.data.data
          if (moneyMsg != null) {
            let msg = {
              type: "msg",
              content: moneyMsg,
              is: false,
              image: "../../image/img.jpg",
              recordSrc: that.textToRecord(moneyMsg)
            }
            data.addMsg(msg)
            that.setMsgList()
            return
          } else {
            that.postMsgRecord(content)
          }
        }
      )
    } catch (error) {

      console.error(error)
      let text = "你可以问点其他的"
      let msg = {
        type: "msg",
        content: text,
        is: false,
        image: "../../image/img.jpg",
        recordSrc: that.textToRecord(text)

      }
      data.addMsg(msg)
      that.setMsgList()
    }

  },


  //机器人返回消息 
  postMsgRecord(content) {

    let that = this
    w_post(
      data.getUrl('/aibot'),
      {
        signature: that.data.signature,
        query: content
      },
      res => {
        console.log(res);
        let msg = {
          type: "msg",
          content: res.data.answer,
          is: false,
          image: "../../image/img.jpg",
          recordSrc: that.textToRecord(res.data.answer)
        }
        data.addMsg(msg)

        if (res.data.skill_name == "音乐") {
          let msgMusic = {
            type: 'music',
            musicList: data.formatMusic(res.data.more_info.music_ans_detail)
          }
          data.addMsg(msgMusic)
        } else if (res.data.ans_node_name.search("FM") != -1) {
          let msgMusic = {
            type: 'music',
            musicList: data.formatFM(res.data.more_info.fm_ans_detail)
          }
          data.addMsg(msgMusic)
        } else if (res.data.ans_node_name.search("新闻") != -1) {
          let newsList = {
            type: 'news',
            newsList: data.formatNews(res.data.more_info.news_ans_detail)
          }
          data.addMsg(newsList)
        }



        that.setMsgList()

      },
      res => {
        console.log("错误", res);
        wx.showToast({
          title: '发送错误'
        });
      }
    )
  },


  //点击显示语音的方法
  showRecord() {
    this.pageScrollToBottom()
    if (wx.getStorageSync("is_first") != 1) {
      this.getUserProfile()
      return
    }
    this.setData(
      {
        isRecord: !this.data.isRecord
      }
    )
  },

  //按住开始录音
  startRecord(e) {
    wx.vibrateShort({
      type: 'heavy'
    });
    this.setData({
      isRecordStart: true,
      recordText: "录音中, 手指移动到白色区域发送"
    })
    console.log(e);
    manager.start({ duration: 30000, lang: "zh_CN" })
  },

  //结束录音
  endRecord(e) {
    this.setData({
      isRecordStart: false,
      recordText: "按住 说话"
    })
    console.log(e);
    manager.stop()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setMsgList()
    that.getSignature()
    that.setRecord()
    //滚到底部
    that.pageScrollToBottom()
  },

  setTime() {
    //设置时间
    let hours = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()
    let minutes = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()
    that.setData({
      time: hours + ":" + minutes
    })
  },


  //获取登陆信息
  getSignature() {
    let that = this
    //登陆获取signature
    w_post(data.getUrl('/sign'),
      {
        userid: wx.getStorageSync("userid"),
        username: wx.getStorageSync("username"),
        avatar: wx.getStorageSync("avatar"),
      },
      res => {
        console.log(res.data);
        that.setData({
          signature: res.data.signature,
          image: wx.getStorageSync("avatar")
        })
      }
    )
  },


  //获取用户信息
  getUserProfile() {
    let that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync("is_first", 1);
        wx.setStorageSync("userid", res.userInfo.city + res.userInfo.nickName + res.userInfo.avatarUrl);
        wx.setStorageSync("username", res.userInfo.nickName);
        wx.setStorageSync("avatar", res.userInfo.avatarUrl)
        that.onShow()
        console.log(res);
      }
    })
  },


  //滚动到底部的方法
  pageScrollToBottom() {
    wx.createSelectorQuery().select('#scrollpage').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.height,
      });
    }).exec()
  },

})