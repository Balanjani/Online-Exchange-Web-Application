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

var currentRoute = '/userbids/'

// GET: display user's profile
router.get("/", middleware.isLoggedIn, async (req, res) => {
    

    // var products =productModel.find({}); 
    let page = parseInt(req.query.page) || 1;

    try {
     
      const perPage = 8;
      const items = await Bid.find({  })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("productId");
      
   
      const count = await Bid.count({  });

      res.render("userbids/", {
        pageName: 'My Products',
        //currentCategory: foundCategory,
        items: items,
        current: page,
        breadcrumbs: req.breadcrumbs,
        home: currentRoute + "?",
        actionHome: currentRoute + "",
        pages: Math.ceil(count / perPage),
      });


      
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  });



  
  
  module.exports = router;