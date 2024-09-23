const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

const middleware = require("../middleware");
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
} = require("../config/validator");

const csrfProtection = csrf();
router.use(csrfProtection);

// GET: display the signup form with csrf token
router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign Up",
  });
});
// POST: handle the signup logic
router.post(
  "/signup",
  [
    middleware.isNotLoggedIn,
    userSignUpValidationRules(),
    validateSignup,
    passport.authenticate("local.signup", {
      successRedirect: "/user/logout",
      failureRedirect: "/user/signup",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      
     
      console.log('sucessssss fdsf f fd fd')
      req.flash("success", 'Verify from email');
      res.redirect("/");
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display the signin form with csrf token
router.get("/signin", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    errorMsg,
    pageName: "Sign In",
  });
});

// POST: handle the signin logic
router.post(
  "/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
      failureRedirect: "/user/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
     
      // redirect to old URL before signing in
      if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      } else {
        res.redirect("/user/profile");
      }
    } catch (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect("/");
    }
  }
);

// GET: display user's profile
router.get("/profile", middleware.isLoggedIn, async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    // find all orders of this user
    allOrders = await Order.find({ user: req.user });
    res.render("user/profile", {
      orders: allOrders,
      errorMsg,
      successMsg,
      pageName: "User Profile",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

// GET: logout
router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  
  res.redirect("/");
});


// GET: display the form  form with csrf token
router.get("/verifyToken", middleware.isNotLoggedIn, async (req, res) => {

  if(!req.query.token)
  {
    console.log('token here')
    req.flash("success", 'Invalid token');
    return res.redirect("/");
  }

  console.log('req.get.token',req.query.token )
  let user = await User.findOne({ token: req.query.token, tokenstatus: true });
  if(!user)
  {
    req.flash("error", 'Invalid token');
    return res.redirect("/user/verifyToken");
  }
  
  user.verified = true
  user.tokenstatus = false
  await user.save();

  console.log('user', user)
  req.flash("success", 'Email verified, please login ');
  return res.redirect("/");


  // var errorMsg = req.flash("error")[0];
  // res.render("user/verifyToken", {
  //   csrfToken: req.csrfToken(),
  //   errorMsg,
  //   pageName: "verify Token",
  // });
});


// router.post(
//   "/verifyToken",
  
//   async (req, res) => {
//     try {
      
//       console.log('fdsfds', req.body.token)
//       let user = await User.findOne({ token: req.body.token, tokenstatus: true });
//       if(!user)
//       {
//         req.flash("error", 'Invalid token');
//         return res.redirect("/user/verifyToken");
//       }
      
//       user.verified = true
//       await user.save();

//       console.log('user', user)
//       req.flash("success", 'Email verified, please login ');
//       return res.redirect("/");
//     } catch (err) {
//       console.log(err);
//       req.flash("error", err.message);
//       return res.redirect("/");
//     }
//   }
// );


module.exports = router;
