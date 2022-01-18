const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', (req, res) =>{    
    res.render('index', {restaurant: restaurantList.results})
})

app.get ('/search', (req,res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()) || restaurant.category.includes(keyword)
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