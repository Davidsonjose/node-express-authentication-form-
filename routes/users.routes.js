const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");
// const { Passport } = require('../config/auth');

// Login Page
//login page
router.get("/login", (req, res) => res.render("login"));

//register page
router.get("/register", (req, res) => res.render("register"));

//Register handler
// Login
  router.post("/register", async (req, res) => {
    const { name, email, password, password2 } = req.body;

    //initialize array (errors)
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please fill all the fields" });
    }

    //check password match
    if (password !== password2) {
      errors.push({ msg: "password do not match" });
    }

    //check password lenth
    if (password.length < 6 || password.length > 12) {
      errors.push({
        msg: "password should not be less than 6 or more than 12 characters",
      });
    }

    //when an error occur
    if (errors.length > 0) {
      res.render("register", {
        errors,
        name,
        email,
        password,
        password2,
      });
    } else {
      const emailExist = await User.findOne({ email: email });
      if (emailExist) {
        //User exist
        errors.push({ msg: `${email} is already registered` });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        // console.log(newUser);  logging to the console new user
        req.flash("success_msg", "You are now registered and can login");
        
        res.redirect("/users/login");
        // res.send("hello");
        //using the promise method without using the async await(you can use the one written above or this one here)
        // User.findOne({ email: email })
        // .then((emailExist => {
        //   if (emailExist) {
        //     errors.push({msg: "Email is already registered"});
        //     res.render('register', {
        //       errors,
        //       name,
        //       email,
        //       password,
        //       password2
        //     });
        //   } else{
        //     const newUser = new User({
        //       name,
        //       email,
        //       password,
        //     })
        // }   //end

        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;
            //Save user
            await newUser
              .save()
              .then((newUser) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
      }
    }
  });
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are succesfully logged out");
  res.redirect("/users/login");
});

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const passport = require('passport');
// // Load User model
// const User = require('../models/User');
// // const { forwardAuthenticated } = require('../config/auth');

// // Login Page
// router.get('/login',  (req, res) => res.render('login'));

// // Register Page
// router.get('/register',  (req, res) => res.render('register'));

// // Register
// router.post('/register', (req, res) => {
//   const { name, email, password, password2 } = req.body;
//   let errors = [];

//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: 'Please enter all fields' });
//   }

//   if (password != password2) {
//     errors.push({ msg: 'Passwords do not match' });
//   }

//   if (password.length < 6) {
//     errors.push({ msg: 'Password must be at least 6 characters' });
//   }

//   if (errors.length > 0) {
//     res.render('register', {
//       errors,
//       name,
//       email,
//       password,
//       password2
//     });
//   } else {
//     User.findOne({ email: email }).then(user => {
//       if (user) {
//         errors.push({ msg: 'Email already exists' });
//         res.render('register', {
//           errors,
//           name,
//           email,
//           password,
//           password2
//         });
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           password
//         });

//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then(user => {
//                 req.flash(
//                   'success_msg',
//                   'You are now registered and can log in'
//                 );
//                 res.redirect('/users/login');
//               })
//               .catch(err => console.log(err));
//           });
//         });
//       }
//     });
//   }
// });

// // Login
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash: true
//   })(req, res, next);
// });


// // Logout
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

// module.exports = router;
