const moment = require("moment");

function formatMessage(username,message){
    return{
        username,
        message,
        time:moment().format("hh:mm A")
    }
}

module.exports=formatMessage;