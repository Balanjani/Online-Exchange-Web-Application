const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const middleware = require("../middleware");
const productModel = require("../models/product");
const Order = require("../models/order");
const Category = require("../models/category");
const User = require("../models/user");
var moment = require("moment");
var multer  = require('multer');
var path = require('path');
var mongodb = require('mongodb');

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

var currentRoute = '/categories/'

// GET: display user's profile
router.get("/", middleware.isLoggedIn, async (req, res) => {
    

    // var products =productModel.find({}); 
    let page = parseInt(req.query.page) || 1;

    try {
     
      const perPage = 8;
      const items = await Category.find({  })
      .skip(perPage * page - perPage)
      .limit(perPage);
      
      const count = await Category.count({  });

      res.render("categories/", {
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



  
// GET: display user's profile
router.get("/view/:slug", middleware.isLoggedIn, async (req, res) => {
    
// console.log('req.params.slug', req.params.slug)
  

  try {
   
    const item = await Category.findById(req.params.slug ).populate("category");

    res.render("categories/detail", {
      item: item,
      pageName: 'My Products',
      breadcrumbs: req.breadcrumbs,
      moment: moment,
    });


    
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});

  
// GET: display user's profile
router.get("/edit/:slug", middleware.isLoggedIn, async (req, res) => {
    
console.log('req.params.slug', req.params.slug)
  

try {
    
  const item = await Category.findById(req.params.slug ).populate("category");

  
 

  res.render("categories/form", {
    item: item,
    pageName: 'Categories',
    breadcrumbs: req.breadcrumbs,
    moment: moment,
    csrfToken: 'fdsfds',
    isNewRecord: 0
  });


  
} catch (err) {
  console.log(err);
  return res.redirect("/");
}
});



// GET: display user's profile
router.get("/delete/:slug", middleware.isLoggedIn, async (req, res) => {
    
 
  try {
     
    const result = await Category.deleteOne({_id: new mongodb.ObjectID(req.params.slug )} );
  
    return res.redirect("/categories");

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


  






// GET: display user's profile
router.get("/add", middleware.isLoggedIn, async (req, res) => {
    // console.log('req.params.slug', req.params.slug)
    console.log('/categories/add')
    
    var loginUser = req.session.adminName
    try {
    
      const item = new Category();
      // console.log('item', item)
      const categories = await Category.find();

      res.render("categories/form", {
        item: item,
        pageName: 'Categories',
        breadcrumbs: req.breadcrumbs,
        moment: moment,
        csrfToken: 'fdsfds',
        isNewRecord: 1
      });
  
  
      
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  });



  
// GET: display user's profile
router.post("/post", upload,
  [
    middleware.isLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  
  console.log('reqest  fdfdsf', req.body)
  
  try {

    if( parseInt(req.body.isNewRecord) == 1)
    {
      var model = new Category()
    }
    else
    {
      var model = await Category.findById(req.body.id)
    }
    
   
    var loginUser = req.session.adminName
    //var productDetails = await productModel.findById(req.body.id)
  
    model.title = req.body.title;
    
    


    if(req.files.length > 0)
      model.imagePath = req.files[0].filename;

    
    model.save(function(err, data){
        if(err) console.log(err);
        // console.log(data)
        return res.redirect(currentRoute);
    })

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});



  
  
  module.exports = router;