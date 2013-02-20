var mongoose = require('mongoose')
  , Timer = mongoose.model('Timer')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app, passport, auth) {
  var timers = require('../app/controllers/timers')
  var trends = require('../app/controllers/trends')
  var users = require('../app/controllers/users')

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)

  app.param('userId', users.user)

  // timer routes
  app.get('/timers', auth.requiresLogin, auth.timer.hasAuthorization, timers.index)
  app.get('/trends', auth.requiresLogin, auth.timer.hasAuthorization, trends.index)
  app.post('/timers', auth.requiresLogin, auth.timer.hasAuthorization, timers.create)
  app.del('/timers/:id', auth.requiresLogin, auth.timer.hasAuthorization, timers.destroy)
  app.post('/timers/:id/stop', auth.requiresLogin, auth.timer.hasAuthorization, timers.stop)

  app.param('id', timers.timer)

  // home route
  app.get('/', timers.index)

}
