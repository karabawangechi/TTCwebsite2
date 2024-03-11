"use strict";

var express = require("express");

var app = express();

var bodyParser = require('body-parser');

var session = require('express-session');

var cookieParser = require('cookie-parser');

var MongoStore = require('connect-mongo');

var connectDB = require('./config/db.config');

var multer = require('multer');

var Contact = require('./models/contactform.js');

var Registration = require('./models/register.js');

var nodemailer = require('nodemailer'); // Added nodemailer


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
app.use(express["static"]('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express["static"]('assets'));
app.use(express["static"]('assets'));
app.use(express["static"]('uploads'));
app.use(express["static"]('node_modules'));
app.use('/', router);
router.get('/index', function (req, res) {
  res.render("index.ejs");
});
router.get('/about', function (req, res) {
  res.render("about.ejs");
});
router.get('/contact', function (req, res) {
  res.render("contact.ejs");
});
router.get('/courses', function (req, res) {
  res.render("courses.ejs");
});
router.get('/feesstructure', function (req, res) {
  res.render("feesstructure.ejs");
});
router.get('/register', function (req, res) {
  res.render("register.ejs");
});
router.get('/registerconfirmation', function (req, res) {
  res.render("registerconfirmation.ejs");
}); // Set up multer storage for file uploads

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
}); // Handle POST request for registration form
// Handle POST request for registration form

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
  var _req$body, name, email, files, newRegistration, transporter, mailOptions;

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
          // Send email notification
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'Iseatout@gmail.com',
              pass: 'iwrnouidsjrjvbzw' // Provide your Gmail app password here

            }
          });
          mailOptions = {
            from: 'Iseatout@gmail.com',
            to: email,
            subject: 'Registration Successful',
            text: "Thank you for registering with Mwencha TTC. Please note that you need to pay Ksh1000 unrefundable registration fee with Paybill 124536. Please forward the M-Pesa message to mwenchattc2023@gmail.com for confirmation."
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
          res.render('registrationconfirmation.ejs');
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          console.error('Error processing registration:', _context.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
app.post('/contactform', function _callee2(req, res) {
  var _req$body2, name, email, subject, message, newContact;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // Extract data from the request body
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email, subject = _req$body2.subject, message = _req$body2.message; // Create a new contact document

          newContact = new Contact({
            name: name,
            email: email,
            subject: subject,
            message: message
          }); // Save the contact document to the database

          _context2.next = 5;
          return regeneratorRuntime.awrap(newContact.save());

        case 5:
          // Send response indicating successful contact form submission
          res.render('contact.ejs', {
            successMessage: 'Your message has been sent. Thank you!'
          });
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.error('Error processing contact form:', _context2.t0);
          res.status(500).json({
            error: 'Internal Server Error'
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
}); // Other routes and middleware...

app.listen(PORT, function () {
  console.log("App is listening on port ".concat(PORT));
});
//# sourceMappingURL=server.dev.js.map
