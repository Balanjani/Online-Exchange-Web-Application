const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const middleware = require("../middleware");
const productModel = require("../models/product");
const Order = require("../models/order");
const Category = require("../models/category");
const Bid = require("../models/bid");
const User = require("../models/user");
var moment = require("moment");
var multer  = require('multer');
var path = require('path');
var mongodb = require('mongodb');
const user = require("../models/user");
const order = require("../models/order");


var Storage= multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).any('file');
// const csrfProtection = csrf();
// router.use(csrfProtection);


var currentRoute = '/superadmin/'

// GET: display user's profile
router.get("/", middleware.isLoggedIn, async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
   
    try {
      // find all orders of this user
      //allOrders = await Order.find({ user: req.user });
      res.render("superadmin/index", {
        //orders: allOrders,
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
router.get("/users", middleware.isLoggedIn, async (req, res) => {
    

  // var products =productModel.find({}); 
  let page = parseInt(req.query.page) || 1;

  try {
   
    const perPage = 8;
    const items = await user.find({  })
    .skip(perPage * page - perPage)
    .limit(perPage);
    
    const count = await user.count({  });

    res.render("superadmin/users", {
      pageName: 'My Products',
      //currentCategory: foundCategory,
      items: items,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: currentRoute + "/users?",
      actionHome: currentRoute + "users",
      pages: Math.ceil(count / perPage),
    });


    
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



// GET: display user's profile
router.get("/orders", middleware.isLoggedIn, async (req, res) => {
    

  // var products =productModel.find({}); 
  let page = parseInt(req.query.page) || 1;

  try {
   
    const perPage = 8;
    const items = await order.find({  })
    .populate(['user'])
    .skip(perPage * page - perPage)
    .limit(perPage);
    
    const count = await order.count({  });
    console.log('orders', items)

    res.render("superadmin/orders", {
      pageName: 'My Products',
      //currentCategory: foundCategory,
      items: items,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: currentRoute + "/users?",
      actionHome: currentRoute + "users",
      pages: Math.ceil(count / perPage),
    });


    
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

  
  
  module.exports = router;