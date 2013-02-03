var mongoose = require('mongoose')
  , Timer = mongoose.model('Timer')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)

  app.param('userId', users.user)

  // timer routes
  var timers = require('../app/controllers/timers')
  app.get('/timers', timers.index)
  app.post('/timers', auth.requiresLogin, timers.create)
  app.del('/timers/:id', auth.requiresLogin, auth.timer.hasAuthorization, timers.destroy)
  app.get('/timers/:id/stop', auth.requiresLogin, auth.timer.hasAuthorization, timers.stop)

  app.param('id', timers.timer)

  // home route
  app.get('/', timers.index)
}
