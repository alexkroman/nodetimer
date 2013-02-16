var mongoose = require('mongoose')
  , async = require('async')
  , pagination = require('mongoose-pagination')
  , Timer = mongoose.model('Timer')
  , _ = require('underscore')

var limit = 80;

exports.redirect = function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else if (req.headers.host.match(/^salty-bayou-8086/) !== null) {
    res.redrect('http://nodetimer.com');
  } else {
    next();
  }
}
 
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

  async.parallel({
    tags: function(callback){
      Timer.tags(req.user, function (err, tags) {
        callback(err, tags);
      });
    },
    ended_timers: function(callback){
      page = parseInt(req.query['page']) || 1
      Timer.endedTimers(req.user).paginate(page, limit, function (err, ended_timers, total) {
        callback(err, ended_timers, total);
      });
    },
    open_timer: function(callback) {
      Timer.openTimer(req.user, function(err, open_timer) {
        callback(err, open_timer);
      });
    },
  },

  function(err, results, total){
    num = page * limit
    total = results['ended_timers'][1]
    next = (num < total) ? true : false
    prev = (num > limit) ? true : false
    res.render('timers/index', {
      title: 'Timers'
      , page: page
      , prev: prev
      , next: next
      , tags: results['tags']
      , next_page: page + 1
      , prev_page: page - 1
      , ended_timers: results['ended_timers'][0]
      , open_timer: results['open_timer']
      , timer: new Timer({})
    })
  });

}

exports.timer = function(req, res, next, id){
  Timer.findOne({ _id : id }).exec(function (err, timer) {
    req.timer = timer
    next()
  })
}

