const express = require('express')
const router = express.Router()
const axios = require('axios')
const app = express()

router.get('/send', async (req, res) => {
    let response = await axios({
        url: 'http://api.qingyunke.com/api.php',
        method: 'get',
        params: req.query
    })
    console.log(req.query.msg);
    console.log(response.data.content);
    res.send(response.data)
})

app.use('/api', router)

app.listen(3000, () => {
    console.log("运行成功", "http://127.0.0.1:3000/api");
})