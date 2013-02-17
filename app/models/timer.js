var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , moment = require('moment')

var TimerSchema = new Schema({
  body: {type : String, default : '', trim : true, set: toTags}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
  , tags : {type: [String]}
  , endedAt  : {type : Date, default : Date.now}
})

TimerSchema.index({user:1, endedAt:1})

function toTags(val) {
  this.tags = val.match(/(#[A-Za-z0-9-_]+)/g)
  return val; 
}

TimerSchema
  .virtual('duration')
  .set(function(duration) {
    this.endedAt = moment().add('minutes', duration)
  })
  .get(function(duration) {
    start = moment(this.createdAt)
    end = moment(this.endedAt)
    return moment.duration(end.diff(start,'minutes'), 'minutes').humanize()
  })

TimerSchema
  .virtual('createdAtHumanize')
  .get(function(createdAt) {
    return moment(this.createdAt).calendar()
  })

TimerSchema
  .virtual('createdAtTime')
  .get(function(createdAtTime) {
    return moment(this.createdAt).format('h:mma')
  })

TimerSchema
  .virtual('timeLeft')
  .get(function(timeLeft) {
    return moment(this.endedAt).fromNow()
  })

TimerSchema.statics.openTimer = function(user, callback) {
    return this.findOne({"user": user, "endedAt": {"$gt": new Date() }}, callback)
}

TimerSchema.statics.endedTimers = function(user, callback) {
  options = {
    "endedAt": {"$lt": new Date() }
    , "user": user
  }
  return this.find(options).sort({'endedAt': -1}).find(callback)
}

TimerSchema.statics.tags = function(user, startOf, callback) {

  var o = {};

  o.query = {
    "endedAt": {"$lt": new Date(), "$gt": moment().startOf(startOf) }
    , "user": user._id 
  }

  o.map = function() {
    if (!this.tags) {
      return;
    }
     
    for (index in this.tags) {
      emit(this.tags[index], {count: 1, duration: Math.floor((Math.abs(this.endedAt - this.createdAt)/1000)/60)});
    }
  }

  o.reduce = function(previous, current) {
    var result = {count : 0, duration: 0}

    for (index in current) {
        result.count += current[index].count;
        result.duration += current[index].duration;
    }

    return result;
  }

  o.out = 'tagResults_' + startOf + '_' + user._id

  this.mapReduce(o, function (err, model, stats) {
    model.find().sort({'value.duration': -1}).exec(callback);
  });

}

mongoose.model('Timer', TimerSchema)
