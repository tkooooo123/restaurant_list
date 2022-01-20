const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})


db.once("open", () => {
    console.log("mongodb connected!")
  
    Restaurant.create(restaurantList)
      .then(() => {
        console.log("RestaurantSeeder done!")
        db.close()
      })
      .catch(err => console.log(err))
  })
