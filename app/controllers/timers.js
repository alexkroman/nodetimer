var mongoose = require('mongoose')
  , async = require('async')
  , Timer = mongoose.model('Timer')
  , _ = require('underscore')

exports.create = function (req, res) {
  var timer = new Timer(req.body)

  timer.user = req.user

  timer.save(function(err){
    if (err) {
      res.render('timers/new', {
        title: 'New Timer'
        , timer: timer
        , errors: err.errors
      })
    }
    else {
      res.redirect('/timers')
    }
  })
}

exports.destroy = function(req, res){
  var timer = req.timer
  timer.remove(function(err){
    res.redirect('/')
  })
}

exports.index = function(req, res){
  Timer
    .find({"endedAt": {"$gte": new Date() }})
    .populate('user', 'name')
    .sort({'endedAt': 1})
    .limit(25)
    .exec(function(err, started_timers) {
      if (err) return res.render('500')
      Timer
        .find({"endedAt": {"$lte": new Date() }})
        .populate('user', 'name')
        .sort({'endedAt': -1})
        .limit(25)
        .exec(function (err, ended_timers) {
        res.render('timers/index', {
          title: 'List of Timers'
          , started_timers: started_timers
          , ended_timers: ended_timers
          , timer: new Timer({})
        })
      });
    })
}

exports.timer = function(req, res, next, id){
  var User = mongoose.model('User')

  Timer
    .findOne({ _id : id })
    .populate('user', 'name')
    .exec(function (err, timer) {
      if (err) return next(err)
      if (!timer) return next(new Error('Failed to load timer ' + id))
      req.timer = timer
    })
}
