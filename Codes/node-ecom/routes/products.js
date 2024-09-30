const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
var moment = require("moment");
const middleware = require("../middleware");
const Bid = require("../models/bid");

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
  try {
    const product = await Product.findById(req.params.id).populate("category");

    console.log('product', product)
    let currentDate = new Date()
   
    console.log('currentDate', currentDate)

    const dateFrom = new Date(product.bidDateOpen);
    const dateTo = new Date(product.bidDateClose);
    let dateFromTime = dateFrom.getTime()
    let dateToTime = dateTo.getTime()
    console.log('dateTo', dateToTime)
    dateToTime = dateToTime + ( 60 * 60 * 24)
    

    let isBidOpen = (currentDate.getTime() >= dateFromTime && currentDate.getTime() <= dateToTime ) 
    const highestBid = await Bid.findOne({ productId: product.id }).sort({amount: 'desc'});
    
    const confirmedBid = await Bid.findOne({ productId: product.id, confirm: true }).sort({amount: 'desc'});

    console.log('isBidOpen',isBidOpen)
    console.log('product',product)


    let canAddToCart = false;
    if(confirmedBid && req.user)
    {
      if(toString(confirmedBid.user) == toString(req.user._id))
        canAddToCart = true
    }
    console.log('confirmedBid', confirmedBid)

    console.log('highestBid', highestBid)
    console.log('canAddToCart', canAddToCart)
    console.log('req.user', req.user)
    res.render("shop/product", {
      pageName: product.title,
      product,
      successMsg,
      errorMsg,
      moment: moment,
      isBidOpen: isBidOpen,
      highestBid: highestBid,
      canAddToCart: canAddToCart,
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
  
  console.log('reqest  fdfdsf', req.body)
  console.log('reqest  req.files', req.files)
  console.log('reqest  isNewRecord', req.body.isNewRecord)

  try {

    var productDetails = await Product.findById(req.body.id)
   
    console.log('productDetails', productDetails)
   
    var loginUser = req.session.adminName
    let bidModel = new Bid();
    bidModel.amount = req.body.amount
    bidModel.productId = req.body.productId
    bidModel.user = req.user._id

    bidModel.save(function(err, data){
      if(err) console.log(err);
      console.log(data)
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



module.exports = router;
