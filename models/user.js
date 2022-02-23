const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {type:String,required:true},
    password : {type:String,required:true},
    channels : [
        {
            channelId : {type:mongoose.Types.ObjectId,required:true},
            channelName  :{type : String,required:true},
            channelDescription  :{type : String,required:true}
        }
    ],
});

module.exports = mongoose.model("User",userSchema);