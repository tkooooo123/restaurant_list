const express = require('express')
const router = express.Router()
//引用 Restaurant model
const Restaurant = require('../../models/Restaurant')

//新增一筆資料
router.get('/new', (req, res) => {
    return res.render('new')
})
router.post('/', (req, res) => {    
    return Restaurant.create(req.body)     // 存入資料庫
      .then(() => res.redirect('/')) // 新增完成後導回首頁
      .catch(error => console.log(error))
  })


module.exports = router