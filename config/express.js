var express = require('express')
  , mongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , viewHelpers = require('./middlewares/view')

module.exports = function (app, config, passport) {
  app.use(require('stylus').middleware(config.root + '/public'));
  app.use(express.static(config.root + '/public'))
  app.use(express.logger('dev'))

  // set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  app.configure(function () {

    // dynamic helpers
    app.use(viewHelpers(config))

    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(express.compress())

    // express/mongo session storage
    app.use(express.session({
      secret: 'node-timer-alexkroman',
      cookie: {
        maxAge: 14 * 24 * 3600000
      },
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))

    // connect flash for flash messages
    app.use(flash())

    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(express.favicon())

    // routes should be at the last
    app.use(app.router)

  })
}
