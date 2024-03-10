"use strict";

var express = require("express");

var app = express();

var bodyParser = require('body-parser');

var session = require('express-session'); //const flash = require('connect-flash');
//const passport = require('passport');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');


var cookieParser = require('cookie-parser'); // Added missing import


var MongoStore = require('connect-mongo'); // Added missing import


var connectDB = require('./config/db.config'); //const Reply = require('./models/reply.model');
//const Blog = require('./models/blog.model');
//const pdfkit = require('pdfkit');
//const fs = require('fs');


var multer = require('multer'); //const Copperivy = require('./models/copperivy');
//const Register = require('./models/registerrestaurant.model');


var upload = multer({
  dest: 'uploads/'
});
var router = express.Router();
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/Mwencha"
  })
}));
app.post('/register', upload.fields([{
  name: 'admissionLetter',
  maxCount: 1
}, {
  name: 'nationalID',
  maxCount: 1
}, {
  name: 'kceseCertificate',
  maxCount: 1
}, {
  name: 'kcseResultSlip',
  maxCount: 1
}, {
  name: 'leavingCertificate',
  maxCount: 1
}, {
  name: 'birthCertificate',
  maxCount: 1
}]), function _callee(req, res) {
  var registrationData, files, newRegistration;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          registrationData = req.body;
          files = req.files; // Save file paths to registration data

          registrationData.admissionLetter = files.admissionLetter[0].path;
          registrationData.nationalID = files.nationalID[0].path;
          registrationData.kceseCertificate = files.kceseCertificate[0].path;
          registrationData.kcseResultSlip = files.kcseResultSlip[0].path;
          registrationData.leavingCertificate = files.leavingCertificate[0].path;
          registrationData.birthCertificate = files.birthCertificate[0].path; // Save registration data to database

          newRegistration = new Registration(registrationData);
          _context.next = 12;
          return regeneratorRuntime.awrap(newRegistration.save());

        case 12:
          res.status(201).send('Registration successful!');
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).send('Internal Server Error');

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
});
app.use(express["static"]('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express["static"]('assets'));
app.use(express["static"]('assets'));
app.use(express["static"]('uploads'));
app.use(express["static"]('node_modules'));
app.use('/', router);
router.get('/index', function (req, res) {
  // Fixed incorrect route
  res.render("index.ejs");
});
router.get('/about', function (req, res) {
  // Fixed incorrect route
  res.render("about.ejs");
});
router.get('/contact', function (req, res) {
  // Fixed incorrect route
  res.render("contact.ejs");
});
router.get('/courses', function (req, res) {
  // Fixed incorrect route
  res.render("courses.ejs");
});
router.get('/register', function (req, res) {
  // Fixed incorrect route
  res.render("courses.ejs");
});

function sendConfirmationEmail(userEmail) {
  var transporter, mailOptions, info;
  return regeneratorRuntime.async(function sendConfirmationEmail$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Create a nodemailer transporter
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: '',
              pass: ''
            }
          }); // Define email options

          mailOptions = {
            from: '',
            to: userEmail,
            // Use the provided userEmail parameter
            subject: 'Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter! You will receive monthly updates on the best places to dine.'
          }; // Send the email

          _context2.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          info = _context2.sent;
          console.log('Email sent:', info);
          return _context2.abrupt("return", info);

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Error sending email:', _context2.t0);
          throw _context2.t0;

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
} // Export the sendConfirmationEmail function


module.exports = {
  sendConfirmationEmail: sendConfirmationEmail
};
app.listen(PORT, function () {
  console.log("App is listening on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
