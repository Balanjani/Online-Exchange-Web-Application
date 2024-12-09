const Chat = require("../models/chat");
const Notification = require("../models/notification");
 



const addNotificationBid = (params) => {
   
    var model = new Notification()
    let messageAction = params.action == 1 ? 'confirmed' : 'rejected'
    model.message = `You bid for  ${params.product.title} is ${messageAction}`  ;
    model.user = params.bid.user  ;   
    model.type = 'bid'  ;   
    
    model.save(function(err, data){
        if(err) console.log(err);
        
    })

}


const addNotificationproductSold = (params) => {
   
    var model = new Notification()
    model.message = `Your product  ${params.product.title} is sold successfully`  ;
    model.user = params.product.user;   
    model.type = 'bid'  ;   
    
    console.log('addNotificationproductSold')
    model.save(function(err, data){
        if(err) console.log(err);
        
    })

}






module.exports = {
    addNotificationBid,
    addNotificationproductSold
};