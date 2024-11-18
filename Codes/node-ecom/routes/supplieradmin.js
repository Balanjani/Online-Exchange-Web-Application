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
const { addNotificationBid } = require("../service/notificationService");


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


var currentRoute = '/supplier-admin/'

// GET: display user's profile
router.get("/", middleware.isLoggedIn, async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
   
    try {
      // find all orders of this user
      //allOrders = await Order.find({ user: req.user });
      res.render("supplieradmin/index", {
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
router.get("/products", middleware.isLoggedIn, async (req, res) => {
    
    var loginUser = req.user
    
    // var products =productModel.find({}); 
    let page = parseInt(req.query.page) || 1;

    try {
     
      const perPage = 8;
      const allProducts = await productModel.find({user: loginUser._id })
      .skip(perPage * page - perPage)
      .limit(perPage);
      
      const count = await productModel.count({user: loginUser._id });
    
      res.render("supplieradmin/products", {
        pageName: 'My Products',
        //currentCategory: foundCategory,
        products: allProducts,
        current: page,
        breadcrumbs: req.breadcrumbs,
        home: "/supplier-admin/products?",
        actionHome: "/supplier-admin/products",
        pages: Math.ceil(count / perPage),
      });


      
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  });



  
// GET: display user's profile
router.get("/products/view/:slug", middleware.isLoggedIn, async (req, res) => {
    

  try {
   
    const product = await productModel.findById(req.params.slug ).populate("category");

    res.render("supplieradmin/product-detail", {
      product: product,
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
router.get("/products/edit/:slug", middleware.isLoggedIn, async (req, res) => {


try {
    
  const product = await productModel.findById(req.params.slug ).populate("category");

  
  const categories = await Category.find();

  res.render("supplieradmin/product-form", {
    categories: categories,
    product: product,
    pageName: 'My Products',
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
router.get("/products/add", middleware.isLoggedIn, async (req, res) => {
 
    var loginUser = req.user
    

    try {
    
      const product = new productModel();
     
      const categories = await Category.find();

      res.render("supplieradmin/product-form", {
        categories: categories,
        product: product,
        pageName: 'My Products',
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
router.post("/products/post", upload,
  [
    middleware.isLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  

  try {

    if( parseInt(req.body.isNewRecord) == 1)
    {
      
      var loginUser = req.user
      var productDetails = new productModel()
      productDetails.user = loginUser._id
      let codeRandom = (Math.random() + 1).toString(36).substring(7);
      

      productDetails.productCode = codeRandom
    }
    else
    {
      
      var productDetails = await productModel.findById(req.body.id)
    }
    
   
    var loginUser = req.session.adminName
    //var productDetails = await productModel.findById(req.body.id)
   
    productDetails.title = req.body.title;
    // productDetails.productCode = req.body.productCode;
    productDetails.price = req.body.price;
    productDetails.category = req.body.category;
    productDetails.description = req.body.description;
    productDetails.bidDateOpen = req.body.bidDateOpen;
    productDetails.bidDateClose = req.body.bidDateClose;
    productDetails.quantity = req.body.quantity;
    

    // var productDetails = new productModel({
    //   title: req.body.title,
    //   productCode: req.body.productCode,
    //   price: req.body.price, 
    //   category: req.body.category,
    //   description: req.body.description,
    //   bidDateOpen: req.body.bidDateOpen, 
    //   bidDateClose: req.body.bidDateClose,
        

    // })



    if(req.files.length > 0)
      productDetails.imagePath = req.files[0].filename;

    
    productDetails.save(function(err, data){
        if(err) console.log(err);
       
        return res.redirect("/supplier-admin/products");
    })

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});







// GET: display user's profile
router.get("/bids/:id", middleware.isLoggedIn, async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  
  var loginUser = req.user
  // console.log('loginUser',loginUser)
  // console.log('req.user',req.user)

  try {
    let page = parseInt(req.query.page) || 1;
    // const items = await Bid.find({productId: req.params.id});
    const perPage = 8;
      const items = await Bid.find({productId: req.params.id}) .skip(perPage * page - perPage)
      .limit(perPage).populate('user')


      const product = await productModel.findById(req.params.id)
     
      //.populate("productId");
      console.log('bids', items)
      
    
      const count = await Bid.count({productId: req.params.id});

      res.render("supplieradmin/bids", {
        pageName: 'My Products',
        //currentCategory: foundCategory,
        items: items,
        current: page,
        breadcrumbs: req.breadcrumbs,
        home: currentRoute + "bids/" + req.params.id + "?",
        actionHome: currentRoute + "",
        pages: Math.ceil(count / perPage),
        product:product,
      });


    
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});






// GET: display user's profile
router.get("/bidconfirm/:id", middleware.isLoggedIn, async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  
  var loginUser = req.user
  // console.log('loginUser',loginUser)
  // console.log('req.user',req.user)

  try {
    let page = parseInt(req.query.page) || 1;
    let action = parseInt(req.query.confirm) ;
    // const items = await Bid.find({productId: req.params.id});
    const perPage = 8;
      const item = await Bid.findById(req.params.id)
      const product = await productModel.findById(item.productId)
      
      //.populate("productId");
      
      
      item.confirm = action
      

      item.save(function(err, data){
        if(err) console.log(err);
        console.log(data)

        if(action == 1)
        {
          product.bidConfirmed = true
          product.save()
          
        }
        
        addNotificationBid({action: action, bid: item, product: product})

        return res.redirect("/supplier-admin/products");
      })




    
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


// GET: display user's profile
router.get("/products/delete/:slug", middleware.isLoggedIn, async (req, res) => {
    
 
  try {
     
    const result = await productModel.deleteOne({_id: new mongodb.ObjectID(req.params.slug )} );
  
    return res.redirect("/supplier-admin/products");

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


  
  
  module.exports = router;