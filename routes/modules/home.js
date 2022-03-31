const express = require('express')
const router = express.Router()
//引用 Restaurant model
const Restaurant = require('../../models/Restaurant')

router.get('/', (req, res) => {
    const userId = req.user._id 
    Restaurant.find({ userId })
        .lean()
        .sort()
        .then(restaurants => res.render('index', { restaurants, userId }))
        .catch(error => console.log(error))
})
router.get('/sort/:sort', (req, res) => {
    const userId = req.user._id 
    const sort = req.params.sort

    Restaurant.find({ userId })
        .lean()
        .sort(`${sort}`)
        .then(restaurants => res.render('index', { restaurants, sort }))
        .catch(error => console.log(error))
})

router.get('/search', (req, res) => {
    const userId = req.user._id 
    const keyword = req.query.keyword.trim().toLowerCase()
    Restaurant.find({ $or: [{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }],userId })
       // $regex: keyword =>查找含有keyword之字串, $options: 'i' => i表示不分大小寫}
        .lean()
        .then(restaurants =>
            res.render('index', { restaurants, keyword })
        )
        .catch(error => console.log(error))
})

module.exports = router