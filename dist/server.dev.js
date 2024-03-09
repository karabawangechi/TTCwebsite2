"use strict";

var express = require("express");

var app = express();

var bodyParser = require('body-parser');

var session = require('express-session');

var flash = require('connect-flash');

var passport = require('passport');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var cookieParser = require('cookie-parser'); // Added missing import


var MongoStore = require('connect-mongo'); // Added missing import


var connectDB = require('./config/db.config');

var Reply = require('./models/reply.model');

var Blog = require('./models/blog.model');

var pdfkit = require('pdfkit');

var fs = require('fs');

var path = require('path');

var Copperivy = require('./models/copperivy');

var Register = require('./models/registerrestaurant.model');

var router = express.Router();
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var PORT = process.env.PORT || 5003;
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/Mwencha"
  })
}));
app.use(express["static"]('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express["static"]('assets'));
app.use(express["static"]('assets'));
app.use(express["static"]('uploads'));
app.use(express["static"]('node_modules'));
app.use('/', router);
router.get('/Index', function (req, res) {
  // Fixed incorrect route
  res.render("Index.ejs.ejs");
});
router.get('/About', function (req, res) {
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
  return regeneratorRuntime.async(function sendConfirmationEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
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

          _context.next = 5;
          return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

        case 5:
          info = _context.sent;
          console.log('Email sent:', info);
          return _context.abrupt("return", info);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Error sending email:', _context.t0);
          throw _context.t0;

        case 14:
        case "end":
          return _context.stop();
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
