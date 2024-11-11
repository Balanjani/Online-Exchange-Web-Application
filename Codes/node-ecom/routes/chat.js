const express = require("express");
const router = express.Router();

const middleware = require("../middleware");

const User = require("../models/user");
const Chat = require("../models/chat");

var _ = require('underscore');
const chat = require("../models/chat");


// const io      = require('socket.io')(http);


const users = [];
var currentRoute = '/categories/'

// GET: display user's profile
router.get("/chatseller/:userid", middleware.isLoggedIn, async (req, res) => {
  
  
    
    // const messages = await Chat.find({userFrom : req.user._id, userTo: req.params.userid}).populate(["userTo", "userFrom"]);
    // const messages = await Chat.find({$or:[{"userFrom":req.user._id},{"userTo":req.params.userid}] }).populate(["userTo", "userFrom"]);
    const messages = await Chat.find(
      {
        $or:[
          {userTo : req.user._id, userFrom: req.params.userid},
          {userFrom : req.user._id, userTo: req.params.userid}
        ]
      }
    ).populate(["userTo", "userFrom"]);
                      

    if(messages)
    {
      messages.forEach(mess => {
        if(messageTo = req.user._id)
        {
          mess.messageReadTo= true;
          mess.save()
        }
        
      });
     
    }

    // console.log('messages', messages)
    let userToModel = await User.findById( req.params.userid)
    let userFromModel = await User.findById( req.user._id)
    let userTo = req.params.userid
    let userFrom = req.user._id
    let userFromName = userFromModel.username
    let userToName = userToModel.username

    let currentUserId = req.user._id
    // console.log('userFromModel', userFromModel)

    // const messagesNotification = await Chat.find({userfrom: req.user._id}).populate(["userTo", "userFrom"]);
    // if(messagesNotification)
    //   messagesNotification[messagesNotification.length - 1].notificationStatus = true
    //   messagesNotification[messagesNotification.length - 1].save()


    try {
     
     

      res.render("chat/index", {
        pageName: 'Chat',
        userTo: userTo,
        userFrom: userFrom,
        userFromName: userFromName,
        userToName: userToName,
        currentUserId: currentUserId,
        messages: messages,
      });


      
    } catch (err) {
      console.log(err);
      return res.redirect("/");
    }
  });



// GET: display user's profile
router.get("/seller", middleware.isLoggedIn, async (req, res) => {
  

    
    
    const messages = await Chat.find({userTo: req.user._id}).populate(["userTo", "userFrom"]).sort({createdAt: 'desc'});;
  
    // console.log('messages', messages)
    

    var destArray = _.uniq(messages, function(x){
      return x.userFrom._id;
    });
     console.log('destArray', destArray)
    
   
    
    _.each(messages, function(x) { 
      let message = x + ' '
      if(x.userFrom._id == req.user._id)
      {
        
      }
    }
    );

    

    

    

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




  
// GET: logout
router.get("/changeMessageReadStatus", middleware.isLoggedIn, async (req, res) => {


  let chatMessage =  await chat.findById(req.query.id );
  console.log('req.query.id', req.query.id)
  chatMessage.messageReadTo = true;
  chatMessage.save();
  
  
});



  
  
  module.exports = router;