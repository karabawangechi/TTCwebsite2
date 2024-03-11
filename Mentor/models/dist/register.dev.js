"use strict";

var mongoose = require('mongoose');

var registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  admissionLetter: {
    type: String,
    required: true
  },
  nationalID: {
    type: String,
    required: true
  },
  kcseCertificate: {
    type: String,
    required: true
  },
  leavingCertificate: {
    type: String,
    required: true
  },
  birthCertificate: {
    type: String,
    required: true
  }
});
var Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
//# sourceMappingURL=register.dev.js.map
