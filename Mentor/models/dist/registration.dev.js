"use strict";

var registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  admissionLetter: String,
  nationalID: String,
  kceseCertificate: String,
  leavingCertificate: String,
  birthCertificate: String
});
var Registration = mongoose.model('Registration', registrationSchema);
//# sourceMappingURL=registration.dev.js.map
