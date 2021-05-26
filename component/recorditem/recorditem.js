// component/recorditem/recorditem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image: {
      type: String,
      value: '../../image/img.jpg'
    },
    content: {
      type: String,
      value: ''
    },
    is: {
      type: Boolean,
      value: false
    },
    recordfile: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isPlay: false
  },
  innerAudioContext: null,

  created() {
    let that = this
    //音乐播放的方法
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.autoplay = true;
    //监听播放
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')

    })
    //监听暂停
    this.innerAudioContext.onPause(() => {
      console.log('暂停播放')
    })

    //监听结束
    this.innerAudioContext.onEnded(() => {
      console.log('播放结束')
      //播放结束 设置图标
      that.setData({
        isPlay: false
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playMusic(e) {
      let innerAudioContext = this.innerAudioContext
      innerAudioContext.src = this.data.recordfile;
      this.setData({
        isPlay: !this.data.isPlay
      })
      if (this.data.isPlay) {
        innerAudioContext.play()
      } else {
        innerAudioContext.pause()
      }
    }
  }
})
