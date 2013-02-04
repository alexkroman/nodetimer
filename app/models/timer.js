var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var moment = require('moment')

var TimerSchema = new Schema({
  body: {type : String, default : '', trim : true}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
  , endedAt  : {type : Date, default : Date.now}
})

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
  .virtual('timeLeft')
  .get(function(timeLeft) {
    return moment(this.endedAt).fromNow()
  })

mongoose.model('Timer', TimerSchema)
