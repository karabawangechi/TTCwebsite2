"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var SubscriberSchema = new Schema({
  email: {
    type: String,
    unique: true
  }
});
var Subscriber = mongoose.model('Subscriber', SubscriberSchema);
module.exports = Subscriber;
//# sourceMappingURL=subscriber.dev.js.map
