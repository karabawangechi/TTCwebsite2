"use strict";

var express = require("express");

var app = express();

var bodyParser = require('body-parser');

var session = require('express-session'); //const multer = require('multer');
//const flash = require('connect-flash');
//const passport = require('passport');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');


var cookieParser = require('cookie-parser'); // Added missing import


var MongoStore = require('connect-mongo'); // Added missing import


var connectDB = require('./config/db.config');

var multer = require('multer');

var Contact = require('./models/contactform.js');

var Registration = require('./models/register.js');

var Subscribe = require('./models/subscriber.js'); //const upload = multer({ dest: 'uploads/' });


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
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/'); // Folder where files will be stored
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  }
});
var upload = multer({
  storage: storage
}); //Handle POST request for registration form

app.post('/register', upload.fields([{
  name: 'admissionLetter',
  maxCount: 1
}, {
  name: 'nationalID',
  maxCount: 1
}, {
  name: 'kcseCertificate',
  maxCount: 1
}, {
  name: 'leavingCertificate',
  maxCount: 1
}, {
  name: 'birthCertificate',
  maxCount: 1
}]), function _callee(req, res) {
  var _req$body, name, email, files, newRegistration;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email;
          files = req.files; // Create a new registration document

          newRegistration = new Registration({
            name: name,
            email: email,
            admissionLetter: files.admissionLetter[0].path,
            nationalID: files.nationalID[0].path,
            kcseCertificate: files.kcseCertificate[0].path,
            leavingCertificate: files.leavingCertificate[0].path,
            birthCertificate: files.birthCertificate[0].path
          }); // Save the registration document to the database

          _context.next = 6;
          return regeneratorRuntime.awrap(newRegistration.save());

        case 6:
          // Send response indicating successful registration
          res.status(201).json({
            message: 'Registration successful'
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error processing registration:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
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
  res.render("register.ejs");
});
router.get('/contact', function (req, res) {
  res.render("contact.ejs", {
    user: user
  });
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
              user: 'Iseatout@gmail.com',
              pass: 'dytjsxykactbirfc'
            }
          }); // Define email options

          mailOptions = {
            from: 'Iseatout@gmail.com',
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
}; // Use the sendConfirmationEmail function in your route handler

app.post('/subscribe', function _callee2(req, res) {
  var email, Subcriber;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.body.email; // Save the subscriber's email in your database or perform any other necessary actions

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(sendConfirmationEmail(email));

        case 4:
          // Render a success page or respond with a success message
          Subcriber = {
            email: email
          };
          res.render('Subscribe.ejs', {
            user: user
          });
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.error('Error subscribing:', _context3.t0);
          res.status(500).json({
            error: 'An error occurred'
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
});
router.post('/contactform', function _callee3(req, res) {
  var _req$body2, name, message, email, subject, contactData, newContact;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, name = _req$body2.name, message = _req$body2.message, email = _req$body2.email, subject = _req$body2.subject; // Assuming you have set up user authentication

          contactData = {
            name: name,
            message: message,
            subject: subject,
            email: email
          };
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Contact.create(contactData));

        case 5:
          newContact = _context4.sent;
          res.render('contact.ejs', {
            newContact: newContact
          }); // Redirect to the newly created reply

          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          console.error('Error creating reply:', _context4.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
});
app.listen(PORT, function () {
  console.log("App is listening on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
