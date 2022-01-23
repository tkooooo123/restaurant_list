const express = require('express')
const router = express.Router()
//引用 Restaurant model
const Restaurant = require('../../models/Restaurant')

router.get('/', (req, res) =>{    
    Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(error => console.log(error))
})

module.exports = router