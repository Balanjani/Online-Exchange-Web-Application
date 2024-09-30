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


var currentRoute = '/supplier-admin/'

// GET: display user's profile
router.get("/", middleware.isLoggedIn, async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
    console.log('fdsfdsfdsfdsfds')
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
    

    // var products =productModel.find({}); 
    let page = parseInt(req.query.page) || 1;

    try {
     
      const perPage = 8;
      const allProducts = await productModel.find({  })
      .skip(perPage * page - perPage)
      .limit(perPage);
      
      const count = await productModel.count({  });

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
    
console.log('req.params.slug', req.params.slug)
  

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
    
console.log('req.params.slug', req.params.slug)
  

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
    // console.log('req.params.slug', req.params.slug)
    
    var loginUser = req.user
    // console.log('loginUser',loginUser)
    // console.log('req.user',req.user)

    try {
    
      const product = new productModel();
      console.log('product', product)
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
  
  console.log('reqest  fdfdsf', req.body)
  console.log('reqest  req.files', req.files)
  console.log('reqest  isNewRecord', req.body.isNewRecord)

  try {

    if( parseInt(req.body.isNewRecord) == 1)
    {
      console.log('reqest  iffffff')
      var loginUser = req.user
      var productDetails = new productModel()
      productDetails.user = loginUser._id
      let codeRandom = (Math.random() + 1).toString(36).substring(7);
      console.log("random", codeRandom);

      productDetails.productCode = codeRandom
    }
    else
    {
      console.log('reqest  elseeeee')
      var productDetails = await productModel.findById(req.body.id)
    }
    
   
    var loginUser = req.session.adminName
    //var productDetails = await productModel.findById(req.body.id)
    console.log('productDetails', productDetails)
    productDetails.title = req.body.title;
    // productDetails.productCode = req.body.productCode;
    productDetails.price = req.body.price;
    productDetails.category = req.body.category;
    productDetails.description = req.body.description;
    productDetails.bidDateOpen = req.body.bidDateOpen;
    productDetails.bidDateClose = req.body.bidDateClose;
    

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
        console.log(data)
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
      const items = await Bid.find({productId: req.params.id})
      .skip(perPage * page - perPage)
      .limit(perPage)
      //.populate("productId");
      
      console.log('items', items)
      const count = await Bid.count({  });

      res.render("supplieradmin/bids", {
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
router.get("/bidconfirm/:id", middleware.isLoggedIn, async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  
  var loginUser = req.user
  // console.log('loginUser',loginUser)
  // console.log('req.user',req.user)

  try {
    let page = parseInt(req.query.page) || 1;
    // const items = await Bid.find({productId: req.params.id});
    const perPage = 8;
      const item = await Bid.findById(req.params.id)
      const product = await productModel.findById(item.productId)
      
      //.populate("productId");
      
      item.confirm = true
      

      item.save(function(err, data){
        if(err) console.log(err);
        console.log(data)

        product.bidConfirmed = true
        product.save()


        return res.redirect("/supplier-admin/products");
      })




    
  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});


  
  
  module.exports = router;