const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const restaurantList = require('../../restaurant.json').results
const db = require('../../config/mongoose')
const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(0, 3)
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678',
    restaurants: restaurantList.slice(3, 6)
  }
]
db.once("open", () => {
  Promise.all(Array.from(SEED_USERS, seedUser => {
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      }))
      .then(user => {
        const userId = user._id
        seedUser.restaurants.forEach(restaurant => {
          restaurant.userId = userId
          //console.log(restaurant)
        })
        return Restaurant.create(seedUser.restaurants)
      })
      
  }))
  .then(() => {
    console.log('done')
    process.exit()
  })
  .catch(err => console.log(err))
})
