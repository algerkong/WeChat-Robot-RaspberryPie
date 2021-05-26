let { w_get, w_post } = require('../../utils/request')

// pages/plugitemset/plugitemset.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        plug: null,
        url: null,
        word: null,
        isAddWord: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options.name);
        let that = this;
        that.setData({
            url: options.url
        })

        console.log('请求的地址是', options.url);
        wx.showLoading({
            title: '加载中...'
        });


        //获取当前插件数据
        w_get(
            options.url + '/api/plugin_list.py',
            {
                op: "getinfo",
                name: options.name
            },
            res => {
                console.log(res.data.data);
                that.setData({
                    plug: res.data.data
                })
                wx.hideLoading();
            },
            res => {
                console.log(res);
            }
        )
    },


    switchSystem(e) {
        this.setData({
            "plug.IsSystem": e.detail.value
        })

        console.log(this.data.plug.IsSystem);
    },

    switchAuto(e) {
        this.setData({
            "plug.AutoLoader": e.detail.value
        })
    },

    switchEnable(e) {
        this.setData({
            "plug.IsEnable": e.detail.value
        })
    },

    changeDisplayName(e) {
        this.setData({
            "plug.displayName": e.detail.value
        })
    },

    changeDescription(e) {
        this.setData({
            "plug.description": e.detail.value
        })
    },

    deleteWord(e) {
        let index = e.currentTarget.dataset.index
        let triggerwords = this.data.plug.triggerwords

        triggerwords.splice(index, 1)
        this.setData({
            'plug.triggerwords': triggerwords
        })
    },

    addWord() {
        let triggerwords = this.data.plug.triggerwords

        triggerwords.push(this.data.word)
        this.setData({
            'plug.triggerwords': triggerwords,
            isAddWord: false
        })
    },

    deletePlug() {
        let that = this

        wx.showModal({
            title: '你确定要删除' + that.data.plug.name + '吗',
            success(res) {
                if (res.confirm) {
                    w_get(
                        that.data.url + '/api/plugin_update.py',
                        {
                            op: 'uninstall',
                            name: that.data.plug.name
                        },
                        res => {
                            console.log('删除插件成功', res);
                            wx.showToast({
                                title: '删除 ' + that.data.plug.name + ' 成功'
                            });
                            wx.navigateBack();
                        },
                        res => {
                            console.log('删除插件错误', res);
                            wx.showToast({
                                title: '删除错误,请重试'
                            });
                        }
                    )
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },

    showInput() {
        this.setData({
            isAddWord: true
        })
    },


    inputWord(e) {
        this.setData({
            word: e.detail.value
        })
    },

    submitTap() {
        let that = this;
        console.log(that.data);

        //提交插件修改的数据
        w_post(
            that.data.url + '/api/plugin_list.py' + '?op=setconfig' + '&data=' + JSON.stringify(that.data.plug),
            {

            },
            res => {
                wx.showToast({
                    title: res.data.message
                });
            },
            res => {
                console.log(res);
            }
        )
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