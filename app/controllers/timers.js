var mongoose = require('mongoose')
  , async = require('async')
  , Timer = mongoose.model('Timer')
  , _ = require('underscore')

exports.create = function (req, res) {
  var timer = new Timer(req.body)
  timer.user = req.user

  timer.save(function(err){
    res.redirect('/')
  })
}

exports.destroy = function(req, res){
  var timer = req.timer
  timer.remove(function(err){
    res.redirect('/')
  })
}

exports.stop = function(req, res){
  var timer = req.timer
  timer.endedAt = Date();
  timer.save(function(err){
    res.redirect('/')
  })
}

exports.index = function(req, res){
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  options = {
    "endedAt": {"$lt": new Date() }
    , "user": req.user 
  }

  if (req.query['find'] == 'all') {
    delete options["user"] 
  }

  Timer
  .find(options)
  .populate('user', 'username')
  .sort({'endedAt': -1})
  .limit(50)
  .exec(function (err, ended_timers) {
    Timer
    .findOne({"user": req.user, "endedAt": {"$gt": new Date() }})
    .exec(function (err, open_timer) {
      res.render('timers/index', {
        title: 'Your timers'
        , ended_timers: ended_timers
        , open_timer: open_timer
        , timer: new Timer({})
      })
    })
  });
}

exports.timer = function(req, res, next, id){
  Timer
    .findOne({ _id : id })
    .populate('user', 'name')
    .exec(function (err, timer) {
      req.timer = timer
      next()
    })
}
