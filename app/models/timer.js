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
    return moment.humanizeDuration(end.diff(start,'minutes'), 'minutes')
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

TimerSchema.statics.tags = function(callback) {

  var mapFunction = function() {
    if (!this.tags) {
      return;
    }

    for (index in this.tags) {
      emit(this.tags[index], 1);
    }
  }

  var reduceFunction = function(previous, current) {
    var count = 0;

    for (index in current) {
        count += current[index];
    }

    return count;
  }

  this.collection.mapReduce(
    mapFunction.toString(),
    reduceFunction.toString(),
    { query: {}, out: { inline: 1 } },
    callback
  );
}

mongoose.model('Timer', TimerSchema)
