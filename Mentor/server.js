const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db.config');
const multer = require('multer');
const Contact = require('./models/contactform.js');
const Registration = require('./models/register.js');
const nodemailer = require('nodemailer'); // Added nodemailer
const router = express.Router();

app.use(bodyParser.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    }
  }));
app.use(bodyParser.urlencoded({ extended: false }))
const PORT = process.env.PORT || 5000;

app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongodb+srv://Francis:mwenchadb@mwencha.5shznhu.mongodb.net/?retryWrites=true&w=majority&appName=Mwencha
    
    })
}));
app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use(express.static('assets'));
app.use(express.static('uploads'));
app.use(express.static('node_modules'));
app.use('/', router);

router.get('/index', (req, res) => {
    res.render("index.ejs");
});
router.get('/about', (req, res) => {
    res.render("about.ejs");
});
router.get('/contact', (req, res) => {
    res.render("contact.ejs");
});

router.get('/courses', (req, res) => {
    res.render("courses.ejs");
});
router.get('/feesstructure', (req, res) => {
    res.render("feesstructure.ejs");
});
router.get('/register', (req, res) => {
    res.render("register.ejs");
});
router.get('/registerconfirmation', (req, res) => {
    res.render("registerconfirmation.ejs");
});



// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Keep original file name
  }
});

const upload = multer({ storage: storage });

// Handle POST request for registration form
// Handle POST request for registration form
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
  
      // Send email notification
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'Iseatout@gmail.com',
          pass: 'iwrnouidsjrjvbzw' // Provide your Gmail app password here
        }
      });
  
      const mailOptions = {
        from: 'Iseatout@gmail.com',
        to: email,
        subject: 'Registration Successful',
        text: "Thank you for registering with Mwencha TTC. Please note that you need to pay Ksh1000 unrefundable registration fee with Paybill 124536. Please forward the M-Pesa message to mwenchattc2023@gmail.com for confirmation."
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      
      res.render('registrationconfirmation.ejs' );
    } catch (error) {
      console.error('Error processing registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.post('/contactform', async (req, res) => {
    try {
        // Extract data from the request body
        const { name, email, subject, message } = req.body;

        // Create a new contact document
        const newContact = new Contact({
            name: name,
            email: email,
            subject: subject,
            message: message
        });

        // Save the contact document to the database
        await newContact.save();

        // Send response indicating successful contact form submission
         res.render('contact.ejs', { successMessage: 'Your message has been sent. Thank you!' });
    } catch (error) {
        console.error('Error processing contact form:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Other routes and middleware...

app.listen(PORT, () => {
    console.log('App is listening on port ${PORT}');
});
