var mongoose = require('mongoose')
  , async = require('async')
  , pagination = require('mongoose-pagination')
  , Timer = mongoose.model('Timer')
  , _ = require('underscore')

var limit = 80;
 
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

  page = parseInt(req.query['page']) || 1
  num = page * limit

  Timer
  .find(options)
  .populate('user', 'username')
  .sort({'endedAt': -1})
  .find()
  .paginate(page, limit, function (err, ended_timers, total) {
    console.log(total)
    Timer
    .findOne({"user": req.user, "endedAt": {"$gt": new Date() }})
    .exec(function (err, open_timer) {
      next = (num < total) ? true : false
      prev = (num > limit) ? true : false
      console.log('prev' + prev + 'next' + next)
      
      res.render('timers/index', {
        title: 'Your timers'
        , page: page
        , prev: prev
        , next: next
        , next_page: page + 1
        , prev_page: page - 1
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
