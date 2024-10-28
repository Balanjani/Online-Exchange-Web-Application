const express = require("express");
const router = express.Router();

const middleware = require("../middleware");

const User = require("../models/user");
const Chat = require("../models/chat");

var _ = require('underscore');


// const io      = require('socket.io')(http);


const users = [];
var currentRoute = '/categories/'

// GET: display user's profile
router.get("/chatseller/:userid", middleware.isLoggedIn, async (req, res) => {
  
  
    
    // const messages = await Chat.find({userFrom : req.user._id, userTo: req.params.userid}).populate(["userTo", "userFrom"]);
    const messages = await Chat.find({$or:[{"userFrom":req.user._id},{"userTo":req.params.userid}] }).populate(["userTo", "userFrom"]);
                      
    console.log('messages', messages)
    let userToModel = await User.findById( req.params.userid)
    let userFromModel = await User.findById( req.user._id)
    let userTo = req.params.userid
    let userFrom = req.user._id
    let userFromName = userFromModel.username
    let userToName = userToModel.username
    console.log('userFromModel', userFromModel)

    try {
     
     

      res.render("chat/index", {
        pageName: 'Chat',
        userTo: userTo,
        userFrom: userFrom,
        userFromName: userFromName,
        userToName: userToName,
        messages: messages,
      });


      
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  });



// GET: display user's profile
router.get("/seller", middleware.isLoggedIn, async (req, res) => {
  

    
    
    const messages = await Chat.find({userTo: req.user._id}).populate(["userTo", "userFrom"]);
  
    console.log('messages', messages)

    var destArray = _.uniq(messages, function(x){
      return x.userTo._id;
    });
    console.log('destArray', destArray)
    

    

    

    try {
     
     

      res.render("chat/seller", {
        pageName: 'Chat',
        destArray: destArray,
        
      });


      
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  });





  
  
  module.exports = router;