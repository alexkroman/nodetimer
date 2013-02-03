exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};

exports.user = {
    hasAuthorization : function (req, res, next) {
      if (req.profile.id != req.user.id) {
        return res.redirect('/users/'+req.profile.id)
      }
      next()
    }
}

exports.timer = {
    hasAuthorization : function (req, res, next) {
      next()
    }
}
