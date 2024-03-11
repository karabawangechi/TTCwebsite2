"use strict";

var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    requires: true
  }
});
var Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;
//# sourceMappingURL=contactform.dev.js.map
