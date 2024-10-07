const Chat = require("../models/chat");
 

const addMessage = (params) => {
    var model = new Chat()
    model.message = params.msg  ;
    model.userTo = params.message_to  ;   
    model.userFrom = params.message_from  ;   
    model.save(function(err, data){
        if(err) console.log(err);
        
    })

}




module.exports = {
    addMessage
};