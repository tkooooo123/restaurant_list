const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
const db = require('../../config/mongoose')

db.once("open", () => {
    console.log("mongodb connected!")
  
    Restaurant.create(restaurantList)
      .then(() => {
        console.log("RestaurantSeeder done!")
        db.close()
      })
      .catch(err => console.log(err))
  })
