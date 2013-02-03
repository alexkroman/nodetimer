module.exports = function (config) {
  return function (req, res, next) {
    res.locals.appName = config.app.name
    res.locals.title = 'Node timer'
    res.locals.req = req
    next()
  }
}
