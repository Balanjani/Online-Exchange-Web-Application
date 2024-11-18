const Chat = require("../models/chat");
const Notification = require("../models/notification");
 



const addNotification = (params) => {
   
    var model = new Notification()
    model.message = `You have new messages from ${params.message_from_name} `  ;
    model.user = params.message_to  ;   
    model.type = 'chat'  ;   
    
    model.save(function(err, data){
        if(err) console.log(err);
        
    })

}


const addMessage =(params) =>  new Promise(function(resolve, reject) {
    // "Producing Code" (May take some time)
    
    var model = new Chat()
    model.message = params.msg  ;
    model.userTo = params.message_to  ;   
    model.userFrom = params.message_from  ;   
    model.messageReadFrom = true;   
    model.messageReadTo = false;   
    model.save(function(err, data){
        if(err) console.log(err);
        console.log('data', data)
        resolve(data)
    })
    
    addNotification(params)
});

const addMessage1 = (params) => {
    var model = new Chat()
    model.message = params.msg  ;
    model.userTo = params.message_to  ;   
    model.userFrom = params.message_from  ;   
    model.messageReadFrom = true;   
    model.messageReadTo = false;   
    model.save(function(err, data){
        if(err) console.log(err);
        console.log('data', data)
        return data;
    })
    
    addNotification(params)

}




module.exports = {
    addMessage
};