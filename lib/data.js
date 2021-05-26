// const utils = require('../../utils/util.js')

// const {
//     data
// } = utils

let msgList = [
    {
        type: "msg",
        content: "你好呀",
        image: "../../image/img.jpg"
    },
]

// 消息列表的操作
//把消息存储到缓存中
if (wx.getStorageSync('msglist') != "") {


    msgList = wx.getStorageSync('msglist')
    console.log(wx.getStorageSync('msglist'), "这是msglist");
}



let addMsg = msg => {
    msg.post_time = new Date().toLocaleString();
    msgList.push(msg)
    wx.setStorageSync("msglist", msgList);
}



// url的操作
let baseUrl = "https://openai.weixin.qq.com/openapi"
//公司的token
// let token = "oZw1A0zk73Sm4T5mQmKSYb0VqDuhBq"
//我的token
let token = "mqJzBVUaCaMANQ0VwRzHjTh353HLyz"
let getUrl = url => {
    return baseUrl + url + "/" + token
}




//音乐信息格式化
let formatMusic = (str) => {
    try {
        let json = JSON.parse(str.replace("\\", ""))
        let musicList = json.play_command.play_list
        console.log("歌曲列表", musicList);
        return musicList;
    } catch (error) {
        console.log(error);
    }
}
//Fm信息格式化
let formatFM = (str) => {
    try {
        let json = JSON.parse(str)
        let playList = json.audio_play_command.play_list
        console.log("FM列表", playList);
        return playList;
    } catch (error) {
        console.log(error);
    }
}

let formatNews = (str) => {
    try {
        console.log(str);
        let json = JSON.parse(str)
        let newsList = json.data.docs
        console.log("新闻列表", newsList);
        return newsList;
    } catch (error) {
        console.log(error);
        console.log(str);
        let json = JSON.parse(str + '"}]}}')
        let newsList = json.data.docs
        console.log("新闻列表", newsList);
        return newsList;
    }
}




//导出
module.exports = {
    baseUrl: baseUrl,
    getUrl: getUrl,
    addMsg: addMsg,
    msgList: msgList,
    formatMusic: formatMusic,
    formatFM: formatFM,
    formatNews: formatNews,
}