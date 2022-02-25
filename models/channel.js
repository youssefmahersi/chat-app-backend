const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    name: {type:String,required:true},
    channelDescription: {type:String,required:true},
    users: {type:Array,required:true},
    chat: {type:Array,required:true},
});

module.exports = mongoose.model("Channel",channelSchema);