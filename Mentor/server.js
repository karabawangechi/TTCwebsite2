const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const Contact = require('./models/contactform.js');
const Registration = require('./models/register.js');
const nodemailer = require('nodemailer'); // Added nodemailer
const router = express.Router();
const mongoose = require('mongoose'); // Import mongoose

const uri = 'mongodb+srv://Francis:mwenchadb@mwencha.5shznhu.mongodb.net/?retryWrites=true&w=majority&appName=Mwencha';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

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
const PORT = process.env.PORT || 10000;

app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: uri // Use the MongoDB URI variable here
    })
}));
// Remove the duplicated line for serving static assets
app.use(express.static('assets'));
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));


app.use(express.static('uploads'));
app.use(express.static('node_modules'));
// app.use('/', router);

app.get('/', (req, res) => {
    res.render("index.ejs");
});
app.get('/about', (req, res) => {
    res.render("about.ejs");
});
app.get('/contact', (req, res) => {
    res.render("contact.ejs");
});

app.get('/courses', (req, res) => {
    res.render("courses.ejs");
});
app.get('/feesstructure', (req, res) => {
    res.render("feesstructure.ejs");
});
app.get('/register', (req, res) => {
    res.render("register.ejs");
});
app.get('/registerconfirmation', (req, res) => {
    res.render("registerconfirmation.ejs");

});
app.get('/health', (req, res) => {
    res.send("testing frontend");
});
app.get('/trainers', (req, res) => {
  res.render("trainers.ejs");
});
app.get('/gallery', (req, res) => {
  res.render("gallery.ejs");
});
app.get('/students', (req, res) => {
  res.render("students.ejs");
});

app.get('/activities', (req, res) => {
  res.render("activities.ejs");
});
app.get('/facilities', (req, res) => {
  res.render("facilities.ejs");
});
app.get('/agriculture', (req, res) => {
  res.render("agriculture.ejs");
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
      
      nationalID: files.nationalID[0].path,
      kcseCertificate: files.kcseCertificate[0].path,
      leavingCertificate: files.leavingCertificate[0].path,
      birthCertificate: files.birthCertificate[0].path
    });

    // Save the registration document to the database
    await newRegistration.save();

    // Send email notification to user
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ttcmwencha@gmail.com',
        pass: 'cdddmdbbjnvxhvsf' // Provide your Gmail app password here
      }
    });

    const mailOptionsToUser = {
      from: 'ttcmwencha@gmail.com',
      to: email,
      subject: 'Registration Successful',
      text: "Thank you for registering with Mwencha TTC. Please note that you need to pay Ksh1000 unrefundable registration fee with Paybill 124536. Please forward the M-Pesa message to ttcmwencha@gmail.com for confirmation."
    };

    transporter.sendMail(mailOptionsToUser, (error, info) => {
      if (error) {
        console.log('Error sending email to user:', error);
      } else {
        console.log('Email sent to user:', info.response);
      }
    });

    // Send email with attachments to ttcmwencha@gmail.com
    const mailOptionsToTTC = {
      from: email,
      to: 'ttcmwencha@gmail.com',
      subject: 'New Registration',
      text: `A new registration has been submitted by ${name} email address ${email}`,
    
      attachments: [
        
        { filename: 'nationalID.pdf', path: files.nationalID[0].path },
        { filename: 'kcseCertificate.pdf', path: files.kcseCertificate[0].path },
        { filename: 'leavingCertificate.pdf', path: files.leavingCertificate[0].path },
        { filename: 'birthCertificate.pdf', path: files.birthCertificate[0].path }
      ]
    };

    transporter.sendMail(mailOptionsToTTC, (error, info) => {
      if (error) {
        console.log('Error sending email to TTC:', error);
      } else {
        console.log('Email sent to TTC:', info.response);
      }
    });

    res.render('registrationconfirmation.ejs');
  } catch (error) {
    console.error('Error processing registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ttcmwencha@gmail.com',
    pass: 'cdddmdbbjnvxhvsf' // Provide your Gmail app password here
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

        let mailOptions = {
          from: '"${name}" <${email}>', // sender address
          to: 'ttcmwencha@gmail.com',
          subject: subject,
          text: message
      };

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
              res.status(500).json({ error: 'Internal Server Error' });
          } else {
              console.log('Email sent: ' + info.response);
              // Send response indicating successful contact form submission
              res.render('contact.ejs', { successMessage: 'Your message has been sent. Thank you!' });
          }
      });
  } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Other routes and middleware...

app.listen(PORT, () => {
   console.log('App is listening on port ${PORT}');
});
