const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/Restaurant')
const methodOverride = require('method-override')
const routes = require('./routes')
const usePassport = require('./config/passport')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const app = express()
const port = process.env.PORT

require('./config/mongoose')

// setting template engine
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true
}))

app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
    console.log(req.user)
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    res.locals.success_msg = req.flash('success_msg')
    res.locals.warning_msg = req.flash('warning_msg')
    next()
})

app.use(routes)
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Express is listening on localhost:${port}`)
})