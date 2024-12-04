const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
var moment = require("moment");
const middleware = require("../middleware");
const Bid = require("../models/bid");
const order = require("../models/order");
const { forEach } = require("underscore");
const rating = require("../models/rating");

// GET: display all products
router.get("/", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  const perPage = 8;
  let page = parseInt(req.query.page) || 1;
  try {
    const products = await Product.find({})
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count();

    res.render("shop/index", {
      pageName: "All Products",
      products,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: null,
      home: "/products/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// GET: search box
router.get("/search", async (req, res) => {
  const perPage = 8;
  let page = parseInt(req.query.page) || 1;
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];

  try {
    const products = await Product.find({
      title: { $regex: req.query.search, $options: "i" },
    })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category")
      .exec();
    const count = await Product.count({
      title: { $regex: req.query.search, $options: "i" },
    });
    res.render("shop/index", {
      pageName: "Search Results",
      products,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: null,
      home: "/products/search?search=" + req.query.search + "&",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//GET: get a certain category by its slug (this is used for the categories navbar)
router.get("/:slug", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  const perPage = 8;
  let page = parseInt(req.query.page) || 1;
  try {
    const foundCategory = await Category.findOne({ slug: req.params.slug });
    const allProducts = await Product.find({ category: foundCategory.id })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count({ category: foundCategory.id });

    res.render("shop/index", {
      pageName: foundCategory.title,
      currentCategory: foundCategory,
      products: allProducts,
      successMsg,
      errorMsg,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: "/products/" + req.params.slug.toString() + "/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

// GET: display a certain product by its id
router.get("/:slug/:id", async (req, res) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];

  var loginUser = req.user
  

  try {
    const product = await Product.findById(req.params.id).populate("category");

    console.log('product', product)
    let currentDate = new Date()
   
    console.log('currentDate', currentDate)

    const dateFrom = new Date(product.bidDateOpen);
    const dateTo = new Date(product.bidDateClose);
    let dateFromTime = dateFrom.getTime()
    let dateToTime = dateTo.getTime()
    // console.log('dateTo', dateToTime)
    dateToTime = dateToTime + ( 60 * 60 * 24)
    

    let isBidOpen = (currentDate.getTime() >= dateFromTime && currentDate.getTime() <= dateToTime ) 
    

    if(product.quantity < 1)
      isBidOpen = false
    
    

    const highestBid = await Bid.findOne({ productId: product.id }).sort({amount: 'desc'});

    let confirmedBid = ''
    let hasUserOrdered = false

    if(req.user)
      

    if(loginUser)
    {
     
      confirmedBid = await Bid.findOne({ productId: product.id, confirm: 1, user: req.user._id }).sort({amount: 'desc'});
      let orders = await order.find({ user: req.user._id }).sort({amount: 'desc'});
      orders.forEach((item) => {
        // console.log(item);
        // console.log('item.items',item.cart.items);
        if(item.cart && item.cart.items)
        {
          item.cart.items.forEach((prod) => {
            //  console.log('prod', prod);
            //  console.log('product.productId.toString()', prod.productId.toString());
            //  console.log(' product._id.toString()',  product._id.toString());
            if(prod.productId.toString() ==  product._id.toString())
              hasUserOrdered = true
            
          })
        }
         
      })
      console.log('hasUserOrdered', hasUserOrdered)

      if(loginUser._id.toString() === product.user.toString()) 
      {
        isBidOpen = false
        //console.log('same user ')
      }
        
    }

    // console.log('hasUserOrdered', hasUserOrdered)
  
    // console.log('product',product)


    let canAddToCart = confirmedBid;
    // if(confirmedBid && req.user)
    // {
    //   if(confirmedBid.user.toString() == req.user._id.toString())
    //     canAddToCart = true
    // }
   
    res.render("shop/product", {
      pageName: product.title,
      product,
      successMsg,
      errorMsg,
      moment: moment,
      isBidOpen: isBidOpen,
      highestBid: highestBid,
      canAddToCart: canAddToCart,
      confirmedBid: confirmedBid,
      hasUserOrdered: hasUserOrdered,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});





  
// GET: display user's profile
router.post("/add-bid",
  [
    middleware.isLoggedIn,
    
  ],
   async (req, res) => {
  // console.log('req.params.slug', req.params.slug)
  


  try {

    var productDetails = await Product.findById(req.body.id)
   
 
   
    var loginUser = req.session.adminName
    let bidModel = new Bid();
    bidModel.amount = req.body.amount
    bidModel.productId = req.body.productId
    bidModel.user = req.user._id

    bidModel.save(function(err, data){
      if(err) console.log(err);
   
      return res.redirect("/products");
    })
  
    //var productDetails = await productModel.findById(req.body.id)
    // console.log('productDetails', productDetails)
    // productDetails.title = req.body.title;
   

    // if(req.files.length > 0)
    //   productDetails.imagePath = req.files[0].filename;

    
    // productDetails.save(function(err, data){
    //     if(err) console.log(err);
    //     console.log(data)
    //     return res.redirect("/supplier-admin/products");
    // })

  } catch (err) {
    console.log(err);
    return res.redirect("/");
  }
});





// GET: display user's profile
router.post("/add-rating",
  [
    middleware.isLoggedIn,
    
  ],
   async (req, res) => {
  try {

    var productDetails = await Product.findById(req.body.productId)
    console.log('req.body', req.body)
   
 
 
     let ratingModel = new rating();
     ratingModel.rating = req.body.rating
     ratingModel.comment = req.body.comment
     ratingModel.productId = req.body.productId
     ratingModel.user =  req.user._id
    

     ratingModel.save(function(err, data){
      if(err) console.log(err);
   
      res.json({ message: 'success', status: 200 });
    })

   

  } catch (err) {
    console.log(err);
    //return res.redirect("/");
  }
});



module.exports = router;
