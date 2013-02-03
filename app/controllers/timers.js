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
  console.log('got here')

    res.redirect('/')
}

exports.index = function(req, res){
  Timer
    .find({"endedAt": {"$gt": new Date() }})
    .populate('user', 'name')
    .sort({'endedAt': 1})
    .limit(10)
    .exec(function(err, started_timers) {
      if (err) return res.render('500')
      Timer
        .find({"endedAt": {"$lt": new Date() }})
        .populate('user', 'name')
        .sort({'endedAt': -1})
        .limit(10)
        .exec(function (err, ended_timers) {
          Timer
            .findOne({"user": req.user, "endedAt": {"$gt": new Date() }})
            .exec(function (err, open_timer) {
              res.render('timers/index', {
                title: 'List of Timers'
                , started_timers: started_timers
                , ended_timers: ended_timers
                , open_timer: open_timer
                , timer: new Timer({})
              })
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
