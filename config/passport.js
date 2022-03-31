const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
    //初始化passport模組
    app.use(passport.initialize())
    app.use(passport.session())
    //設定本地登入策略
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email })
            .then(user => {
                if (!user) {
                    return done(null, false)
                }
                return bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                      return done(null, false)
                    }
                    return done(null, user)
                  })
            })
            .catch(err => done(err, false))
    }))
    passport.use(new FacebookStrategy({
        clientID: 'SKIP',
        clientSecret: 'SKIP',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['email', 'displayName']
      }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
      }))
    //設定序列化與反序列化
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}
