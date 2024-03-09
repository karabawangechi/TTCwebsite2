const registrationSchema = new mongoose.Schema({
    name: String,
    admissionLetter: String,
    nationalID: String,
    kceseCertificate: String,
    kcseResultSlip: String,
    leavingCertificate: String,
    birthCertificate: String
  });
  
  const Registration = mongoose.model('Registration', registrationSchema);