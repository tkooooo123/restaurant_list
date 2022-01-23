const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')  //載入mongoose
const app = express()
const bodyParser = require('body-parser')
const port = 3000
const Restaurant = require('./models/Restaurant')
const methodOverride = require('method-override')
const routes = require('./routes')

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


app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(routes)




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
app.put('/restaurants/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findByIdAndUpdate(id, req.body)
    .then(() => res.redirect(`/restaurants/${id}/`))
    .catch(error => console.log(error))
})
//刪除一筆餐廳資料
app.delete('/restaurants/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get ('/search', (req,res) => {
    const keyword = req.query.keyword.trim().toLowerCase()
    Restaurant.find({$or: [{name: { $regex: keyword, $options: 'i' }}, {category: { $regex: keyword, $options: 'i' }}]})
    // $regex: keyword =>查找含有keyword之字串, $options: 'i' => i表示不分大小寫}
    .lean()
    .then(restaurants => {
        res.render('index', {restaurants, keyword})
    })
    .catch(error => console.log(error))
})

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})