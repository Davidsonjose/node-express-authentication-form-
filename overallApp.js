

// const express = require("express");
// const expressLayouts = require("express-ejs-layouts");
// const mongoose = require("mongoose");
// const passport = require('./config/passport');

// //flash messages
// const flash = require("connect-flash");
// const session = require("express-session");

// const indexRoute = require('./routes/index.routes');
// const userRoute = require('./routes/users.routes');


// //initialized app
// const app = express();

// // Passport Config
// require('./config/passport')(passport);

// //mongodb connect
// app.use(expressLayouts);
// app.set("view engine", "ejs");

// // Express body parser middleware
// app.use(express.urlencoded({ extended: true }));

// // Express session middleware
// app.use(
//   session({
//     secret: "davidson",
//     resave: true,
//     saveUninitialized: true,
//   })
// );

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect flash middleware
// app.use(flash());

// // Global variables middleware(coming from flash)
// app.use(function (req, res, next) {
  //   res.locals.success_msg = req.flash("success_msg");
//   res.locals.error_msg = req.flash("error_msg");
//   res.locals.error = req.flash("error");
//   next();
// });

// // Routes middlwares   
// app.use("/", indexRoute);
// app.use("/users", userRoute);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, console.log(`Server running on port ${PORT}`));
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/Authentication-form", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
// EJS middleware

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.routes.js'));
app.use('/users', require('./routes/users.routes.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on  ${PORT}`));
