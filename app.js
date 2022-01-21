const express = require('express')
const exphbs = require('express-handlebars')
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

//瀏覽一筆資料
app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', {restaurant}))
    .catch(error => console.log(error))
})

//修改一筆資料
app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', {restaurant}))
    .catch(error => console.log(error))
})
app.post('/restaurants/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}/`))
    .catch(error => console.log(error))
})
//刪除一筆餐廳資料
app.post('/restaurants/:id/delete', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get ('/search', (req,res) => {
    const keyword = req.query.keyword.trim().toLowerCase()
    Restaurant.find()
    .lean()
    .then(restaurants => {
        const filterData = restaurants.filter(data => data.name.toLowerCase().includes(keyword) ||  
        data.category.includes(keyword))
        res.render('index', {restaurants: filterData, keyword})
    })
})

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})