const express = require("express");
const router = express.Router();
const csrf = require("csurf");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const middleware = require("../middleware");
const {
  userSignUpValidationRules,
  userSignInValidationRules,
  validateSignup,
  validateSignin,
} = require("../config/validator");
const connectDB = require("../config/db");
const notification = require("../models/notification");
const { forEach } = require("underscore");
const { generateToken } = require("../helper/common");
const { emailSender } = require("../helper/EmailSender");

const csrfProtection = csrf();
// router.use(csrfProtection);

// GET: display the signup form with csrf token
router.get("/signup", middleware.isNotLoggedIn, (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/signup", {
    csrfToken:'fsdfsd',
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
      
      //if there is cart session, save it to the user's cart in db
      
      // if (req.session.cart) {
      //   const cart = await new Cart(req.session.cart);
      //   cart.user = req.user._id;
      //   await cart.save();
      // }
      // redirect to the previous URL
      // if (req.session.oldUrl) {
      //   var oldUrl = req.session.oldUrl;
      //   req.session.oldUrl = null;
      //   // res.redirect(oldUrl);
      // } else {
      //   // res.redirect("/user/profile");
      // }
     
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
    csrfToken: 'fdsfds',
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
      // cart logic when the user logs in
      let cart = await Cart.findOne({ user: req.user._id });
      // if there is a cart session and user has no cart, save it to the user's cart in db
      if (req.session.cart && !cart) {
        const cart = await new Cart(req.session.cart);
        cart.user = req.user._id;
        await cart.save();
      }
      // if user has a cart in db, load it to session
      if (cart) {
        req.session.cart = cart;
      }
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




// GET: display the signin form with csrf token
router.get("/superadmin/signin", middleware.isNotLoggedIn, async (req, res) => {
  var errorMsg = req.flash("error")[0];
  res.render("user/super-admin-signin", {
    csrfToken: 'fdsfds',
    errorMsg,
    pageName: "Sign In",
  });
});

// POST: handle the signin logic
router.post(
  "/superadmin/signin",
  [
    middleware.isNotLoggedIn,
    userSignInValidationRules(),
    validateSignin,
    passport.authenticate("local.signin", {
      failureRedirect: "/user/superadmin/signin",
      failureFlash: true,
    }),
  ],
  async (req, res) => {
    try {
      console.log('req.user', req.user)
      console.log('req.user.superadmin', req.user.superadmin)
      console.log('req.user.phone  ', req.user.phone)
      if(!req.user.superadmin)
      {
        req.logout();
        req.session.cart = null;
        req.flash("error", 'You do not have permission to access superadmin');
        res.redirect("/user/superadmin/signin");
        
      }
      else
      {
        res.redirect("/superadmin");
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



// GET: display user's profile
router.get("/profileupdate", middleware.isLoggedIn, async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
   let user = await User.findById(req.user._id );
  
  try {
    // find all orders of this user
   
    res.render("user/profileupdate", {
      user: user,
      errorMsg,
      successMsg,
      pageName: "User Profile",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


// GET: display user's profile
router.post("/profileupdate",
  [
    middleware.isLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  

  
  try {

    var model =  await User.findById(req.user._id );
    
    
   
    //var productDetails = await productModel.findById(req.body.id)
   
    let pass = req.body.pass;
    let confirm = req.body.confirmpass;
    
   
    
      model.username = req.body.username;
      model.address = req.body.address;
      model.phone = req.body.phone ;
    
      model.save(function(err, data){
          if(err) console.log(err);
          
          return res.redirect('/');
      })
    

    

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


// GET: display user's profile
router.get("/updatepassword", middleware.isLoggedIn, async (req, res) => {
  
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
   let user = await User.findById(req.user._id );

  try {
    // find all orders of this user
   
    res.render("user/updatepassword", {
      user: user,
      errorMsg,
      successMsg,
      pageName: "User Profile",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



// GET: display user's profile
router.post("/updatepassword",
  [
    middleware.isLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  

  
  try {

    var model =  await User.findById(req.user._id );
    
    
   
    //var productDetails = await productModel.findById(req.body.id)
   
    let pass = req.body.pass;
    let confirm = req.body.confirmpass;
    
    if(pass != confirm)
    {
      req.flash("error", 'Passwords not match');
      res.redirect("/user/updatepassword");
      return true;
    }
    else{
      model.password = model.encryptPassword(pass);
    
      model.save(function(err, data){
          if(err) console.log(err);
          
          return res.redirect('/');
      })
    }

    

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



// GET: display user's profile
router.get("/forgotpassword", middleware.isNotLoggedIn, async (req, res) => {
  
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  

  try {
    // find all orders of this user
   
    res.render("user/forgotpassword", {
      errorMsg,
      successMsg,
      pageName: "Reset Password",
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



// GET: display user's profile
router.post("/forgotpassword",
  [
    middleware.isNotLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  

  
  try {

    var model =  await User.findOne({email:req.body.email} );
    
    
    if(!model)
    {
      req.flash("error", 'User not found');
      res.redirect("/user/forgotpassword");
      return true;
    }
    else{

      model.forgotToken = generateToken()
      model.forgotTokenStatus = true
      model.forgotTokenTimeExpire = Date.now() + (20 * 60 * 1000)

      req.flash("success", 'Link send in email to reset password');
      let url  = `http://` + req.headers.host + `/user/resetpassword?token=${model.forgotToken  }`
      console.log('url', url)
     

      
      model.save(function(err, data){
          if(err) console.log(err);
          
          emailSender({mailTo:model.email, data: { username : model.username, url: url  }, type: "resetPass"})
          return res.redirect('/user/signin');
      })
    }

    

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


// GET: display user's profile
router.get("/resetPassword", middleware.isNotLoggedIn, async (req, res) => {
  
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];

  if(!req.query.token)
  {
    req.flash("error", 'Invalid or expired token');
    return res.redirect("/user/signin");
  }

  
  let user = await User.findOne({ forgotToken: req.query.token, forgotTokenStatus: true });
  if(!user) 
  {
    req.flash("error", 'Invalid token');
    return res.redirect("/user/signin");
  }
  

 
  try {
    // find all orders of this user
   
    res.render("user/resetpassword", {
      user: user,
      errorMsg,
      successMsg,
      pageName: "User Profile",
      token: req.query.token,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



// GET: display user's profile
router.post("/resetPassword",
  [
    middleware.isNotLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  

  
  try {


    if(!req.body.token)
      {
        console.log('not token found')
        req.flash("success", 'Invalid token');
        return res.redirect("/");
      }
    
     
      let user = await User.findOne({forgotToken: req.body.token, forgotTokenStatus: true });
      if(!user) 
      {
        console.log('not user found')
        req.flash("error", 'Invalid token');
        return res.redirect("/user/signin");
      }
      

     
      
      console.log(' user found')
  
    //var productDetails = await productModel.findById(req.body.id)
   
    let pass = req.body.pass;
    let confirm = req.body.confirmpass;
    
    if(pass != confirm)
    {
      console.log(' passowrd error')
      req.flash("error", 'Passwords not match');
      res.redirect("/user/resetpassword");
      return true;
    }
    else{
      console.log(' save user')
      user.password = user.encryptPassword(pass);
      user.forgotTokenStatus = false
    
      user.save(function(err, data){
          if(err) console.log(err);
          
          return res.redirect('/');
      })
    }

    

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



// GET: logout
router.get("/logout", middleware.isLoggedIn, (req, res) => {
  req.logout();
  req.session.cart = null;
  res.redirect("/");
});


// GET: logout
router.get("/notificationsstatuschange", middleware.isLoggedIn, async (req, res) => {


  let list =  await notification.find({ user: req.user._id });

  list.forEach(element => {
    element.status= false;
    element.save()
  });
 
  
});



// GET: display the form  form with csrf token
router.get("/verifyToken", middleware.isNotLoggedIn, async (req, res) => {

  if(!req.query.token)
  {
    
    req.flash("success", 'Invalid token');
    return res.redirect("/");
  }

 
  let user = await User.findOne({ token: req.query.token, tokenstatus: true });
  if(!user) 
  {
    req.flash("error", 'Invalid token');
    return res.redirect("/user/verifyToken");
  }
  
  user.verified = true
  user.tokenstatus = false
  await user.save();


  req.flash("success", 'Email verified, please login ');
  return res.redirect("/");


  // var errorMsg = req.flash("error")[0];
  // res.render("user/verifyToken", {
  //   csrfToken: req.csrfToken(),
  //   errorMsg,
  //   pageName: "verify Token",
  // });
});


module.exports = router;
