// component/chatItem/chatItem.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        image: {
            type: String,
            value: '../../image/img.jpg'
        },
        musiclist: {
            type: Array,
            value: []
        }
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
                playIndex: null
            })
        })
    },

    /**
     * 组件的初始数据
     */
    data: {
        playIndex: null,
        //要显示几个
        showNum: 5,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        playMusic(e) {
            let innerAudioContext = this.innerAudioContext
            let index = e.currentTarget.dataset.index
            let url = e.currentTarget.dataset.url

            innerAudioContext.src = url;

            //判断是否是播放的音乐
            if (index != this.data.playIndex) {
                //如果不是 就播放
                innerAudioContext.play()
                //设置当前播放的音乐
                this.setData({
                    playIndex: index
                })
            } else {
                //如果是就暂停
                innerAudioContext.pause()
                //设置没有播放
                this.setData({
                    playIndex: null
                })
            }
        }
    }
})
