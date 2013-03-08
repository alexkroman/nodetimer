var mongoose = require('mongoose'),
  async = require('async'),
  Timer = mongoose.model('Timer'),
  _ = require('underscore');

exports.index = function(req, res){

  if (!req.isAuthenticated()) {
    return res.render('timers/welcome', {
      title: 'Minimize distractions with Node Timer'
    });
  }

  async.parallel({
    dailyTags: function(callback){
      Timer.tags(req.user, 'day', function (err, tags) {
        callback(err, tags);
      });
    },
    weeklyTags: function(callback){
      Timer.tags(req.user, 'week', function (err, tags) {
        callback(err, tags);
      });
    }
  },

  function(err, results, total){
    res.render('trends/index', {
      title: 'Node Timer trends for ' + req.user.name,
      dailyTags: results['dailyTags'],
      weeklyTags: results['weeklyTags']
    });
  });

};
