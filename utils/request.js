function w_get(url, data, success, fail) {
    wx.request({
        url: url,
        header: {
            'content-type': 'application/json',
        },
        method: 'get',
        data: data,
        success(res) {
            success(res);
        },
        fail(res) {
            fail(res);
        }
    });
}


function w_post(url, data, success, fail) {
    wx.request({
        url: url,
        header: {
            'content-type': 'application/json',
        },
        method: 'post',
        data: data,
        success(res) {
            success(res);
        },
        fail(res) {
            fail(res);
        }
    });
}

module.exports = {
    w_get,
    w_post
}