const express = require('express')
const exphbs = require('express-handlebars')
//const restaurantList = require('./restaurant.json')
const mongoose = require('mongoose')  //載入mongoose
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const Restaurant = require('./models/Restaurant')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true }) //設定連線到DB
const db = mongoose.connection  //取得資料庫連線狀態
//連線異常
db.on('error', () => {
    console.log('mongodb error!')
})
//連線成功
db.once('open', () => {
    console.log('mongodb connected!')
})
// setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) =>{    
    Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants}))
    .catch(error => console.log(error))
})

//新增一筆資料
app.get('/restaurants/new', (req, res) => {
    return res.render('new')
})

app.post('/restaurants', (req, res) => {
        
    return Restaurant.create(req.body)     // 存入資料庫
      .then(() => res.redirect('/')) // 新增完成後導回首頁
      .catch(error => console.log(error))
  })

app.get ('/search', (req,res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()) || restaurant.category.includes(keyword.trim())
    })
    res.render('index', {restaurant: restaurants})
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    console.log('req.params.resraurant_id', req.params.restaurant_id)
    const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
    res.render('show', {restaurant: restaurant})
})

app.use(express.static('public'))


app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})