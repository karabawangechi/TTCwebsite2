const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
//const multer = require('multer');
//const flash = require('connect-flash');
//const passport = require('passport');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser'); // Added missing import
const MongoStore = require('connect-mongo'); // Added missing import
const connectDB = require('./config/db.config');

const multer = require('multer');

const Contact =require('./models/contactform.js')
const Registration =require('./models/register.js')
const Subscribe =require('./models/subscriber.js')
//const upload = multer({ dest: 'uploads/' });
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
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Folder where files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Keep original file name
    }
  });
  
const upload = multer({ storage: storage });
//Handle POST request for registration form
app.post('/register', upload.fields([
    { name: 'admissionLetter', maxCount: 1 },
    { name: 'nationalID', maxCount: 1 },
    { name: 'kcseCertificate', maxCount: 1 },
    { name: 'leavingCertificate', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { name, email } = req.body;
      const files = req.files;
  
      // Create a new registration document
      const newRegistration = new Registration({
        name: name,
        email: email,
        admissionLetter: files.admissionLetter[0].path,
        nationalID: files.nationalID[0].path,
        kcseCertificate: files.kcseCertificate[0].path,
        leavingCertificate: files.leavingCertificate[0].path,
        birthCertificate: files.birthCertificate[0].path
      });
  
      // Save the registration document to the database
      await newRegistration.save();
  
      // Send response indicating successful registration
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error processing registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use(express.static('assets'));
app.use(express.static('uploads'));
app.use(express.static('node_modules'));
app.use('/', router);

router.get('/index', (req, res) => { // Fixed incorrect route
    res.render("index.ejs");
});
router.get('/about', (req, res) => { // Fixed incorrect route
    res.render("about.ejs");
});
router.get('/contact', (req, res) => { // Fixed incorrect route
    res.render("contact.ejs");
});

router.get('/courses', (req, res) => { // Fixed incorrect route
    res.render("courses.ejs");
});
router.get('/register', (req, res) => { // Fixed incorrect route
    res.render("register.ejs");
});

router.get('/contact', (req, res) => {
    

    res.render("contact.ejs" ,{user});
    })

    async function sendConfirmationEmail(userEmail) {
        try {
            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'Iseatout@gmail.com',
                    pass: 'dytjsxykactbirfc',
                },
            });
    
            // Define email options
            const mailOptions = {
                from: 'Iseatout@gmail.com',
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
    
    // Use the sendConfirmationEmail function in your route handler
    app.post('/subscribe', async (req, res) => {
        const { email } = req.body;
    
        // Save the subscriber's email in your database or perform any other necessary actions
    
        try {
            // Send the confirmation email by passing the email as a parameter
            await sendConfirmationEmail(email);
    
            // Render a success page or respond with a success message
            const Subcriber = { email };
            res.render('Subscribe.ejs', { user });
        } catch (error) {
            console.error('Error subscribing:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    });
    

    router.post('/contactform',  async (req, res) => {
        const { name, message, email,subject } =req.body
        // Assuming you have set up user authentication
        const contactData = {
            name,
             message,
             subject,
              email };
      
        try {
          const newContact = await Contact.create(contactData);
          res.render('contact.ejs',{newContact}); // Redirect to the newly created reply
        } catch (error) {
          console.error('Error creating reply:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
