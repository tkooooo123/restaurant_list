const express = require('express')
const router = express.Router()
//引用 Restaurant model
const Restaurant = require('../../models/Restaurant')

//新增一筆資料
router.get('/new', (req, res) => {
    return res.render('new')
})
router.post('/', (req, res) => {
    const data = req.body
    data.userId = req.user._id
    return Restaurant.create(data)     // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
})
//瀏覽一筆資料
router.get('/:id', (req, res) => {
    const userId = req.user._id
    const id = req.params.id
    return Restaurant.findOne({ id, userId })
        .lean()
        .then(restaurant => res.render('show', { restaurant }))
        .catch(error => console.log(error))
})
//修改一筆資料
router.get('/:id/edit', (req, res) => {
    const userId = req.user._id
    const id = req.params.id
    return Restaurant.findOne({ id,userId })
        .lean()
        .then((restaurant) => res.render('edit', { restaurant }))
        .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
    const userId = req.user._id 
    const id = req.params.id
    return Restaurant.findOneAndUpdate( {id, userId}, req.body)
        .then(() => res.redirect(`/restaurants/${id}/`))
        .catch(error => console.log(error))
})
//刪除一筆餐廳資料
router.delete('/:id', (req, res) => {
    const userId = req.user._id
    const id = req.params.id
    return Restaurant.findOne({ id, userId })
        .then(restaurant => restaurant.remove())
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

module.exports = router