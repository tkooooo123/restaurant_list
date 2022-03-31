const mongoose = require('mongoose')  //載入mongoose
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //設定連線到DB
const db = mongoose.connection  //取得資料庫連線狀態
//連線異常
db.on('error', () => {
    console.log('mongodb error!')
})
//連線成功
db.once('open', () => {
    console.log('mongodb connected!')
})
module.exports = db