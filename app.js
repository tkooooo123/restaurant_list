const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/Restaurant')
const methodOverride = require('method-override')
const routes = require('./routes')

const app = express()
const port = 3000

require('./config/mongoose')

// setting template engine
app.engine('hbs', exphbs.engine({ defaultLayout: 'main',extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})