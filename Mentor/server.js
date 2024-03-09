const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
//const flash = require('connect-flash');
//const passport = require('passport');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser'); // Added missing import
const MongoStore = require('connect-mongo'); // Added missing import
const connectDB = require('./config/db.config');
//const Reply = require('./models/reply.model');
//const Blog = require('./models/blog.model');
//const pdfkit = require('pdfkit');
//const fs = require('fs');
const multer = require('multer');
//const Copperivy = require('./models/copperivy');
//const Register = require('./models/registerrestaurant.model');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/Mwencha"
    })
}));
app.post('/register', upload.fields([
    { name: 'admissionLetter', maxCount: 1 },
    { name: 'nationalID', maxCount: 1 },
    { name: 'kceseCertificate', maxCount: 1 },
    { name: 'kcseResultSlip', maxCount: 1 },
    { name: 'leavingCertificate', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const registrationData = req.body;
      const files = req.files;
  
      // Save file paths to registration data
      registrationData.admissionLetter = files.admissionLetter[0].path;
      registrationData.nationalID = files.nationalID[0].path;
      registrationData.kceseCertificate = files.kceseCertificate[0].path;
      registrationData.kcseResultSlip = files.kcseResultSlip[0].path;
      registrationData.leavingCertificate = files.leavingCertificate[0].path;
      registrationData.birthCertificate = files.birthCertificate[0].path;
      // Save registration data to database
    const newRegistration = new Registration(registrationData);
    await newRegistration.save();

    res.status(201).send('Registration successful!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use(express.static('assets'));
app.use(express.static('uploads'));
app.use(express.static('node_modules'));
app.use('/', router);

router.get('/Index', (req, res) => { // Fixed incorrect route
    res.render("Index.ejs.ejs");
});
router.get('/About', (req, res) => { // Fixed incorrect route
    res.render("about.ejs");
});
router.get('/contact', (req, res) => { // Fixed incorrect route
    res.render("contact.ejs");
});

router.get('/courses', (req, res) => { // Fixed incorrect route
    res.render("courses.ejs");
});
router.get('/register', (req, res) => { // Fixed incorrect route
    res.render("courses.ejs");
});
async function sendConfirmationEmail(userEmail) {
    try {
        // Create a nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '',
                pass: '',
            },
        });

        // Define email options
        const mailOptions = {
            from: '',
            to: userEmail, // Use the provided userEmail parameter
            subject: 'Subscription Confirmation',
            text: 'Thank you for subscribing to our newsletter! You will receive monthly updates on the best places to dine.',
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info);

        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Export the sendConfirmationEmail function
module.exports = { sendConfirmationEmail };

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
