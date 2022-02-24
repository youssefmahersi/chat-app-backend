const User = require("../../models/user");
const Channel = require("../../models/channel");

exports.getUser = async(req,res,next)=>{
    try{
        
    
    var data;
   const username = req.username; 
    const user = await User.findOne({username : username});
    if(user.channels.length === 0){
        var channelOne = []
    }else{
        var channelOne = await Channel.findById(user.channels[0]._id); 
    }
    data = {
        username : user.username,
        channels: user.channels,
        firstChannel : channelOne
    }
    return res.status(200).json({"message": "resource has been fetched","data": data});
}catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
}

exports.getChannel = async(req,res,next)=>{
    try{
    const channelId = req.params.channelId;
    const channel = await Channel.findById(channelId);
    if(!channel){
        return res.status(404).send("channel not found");
    }
    const user = await User.findOne({username : username});
    const findChannel = user.channels.find((chan)=> chan._id.toString()=== channel._id.toString());
    if(findChannel){
        return res.status(200).send(channel);
    }
    return res.status(401).send("Unauthorized to access this channel");
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
}

exports.searchChannel = async(req,res,next)=>{
    try{
    const channelName = req.body.channelName;
    const channel = await Channel.findOne({name : channelName});
    if(!channel){
        return res.status(404).send("channel not Found !");

    }
    return res.status(200).json({"channel": channel});
}catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
}

exports.createChannel = async(req,res,next)=>{
    try{
    const channelName = req.body.channelName;
    const channelDesc = req.body.channelDescription;
    const username = req.username;
    const user = await User.findOne({username});
    const findChannel = user.channels.find((channel)=> channel.channelName === channelName);
    if(findChannel){
        return res.status(400).send("channel alerady exist !");
    }
    
    const channel = new Channel({
        name : channelName,
        users: [
            {   
                username: user.username
            }
        ],
        chat: []
    })
    console.log(channel)
    user.channels.push({
        channelId : channel._id,
        channelName : channelName,
        channelDescription: channelDesc
    });
    var result = await user.save();
    result = await channel.save();
    return res.status(201).send(result);
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
}

exports.sendMessage = async(req,res,next)=>{
    try{
    const channelId = req.body.channelId;
    const message = req.body.message;
    const username = req.username;
    const channel = await Channel.findById(channelId);
    const user = await User.findOne({username});
    channel.chat.push({
        senderId : user._id.toString(),
        senderUsername: user.username,
        message: message,
        date : new Date()
    })
    const result = await channel.save();
    return res.status(201).send("message created successfuly !");
}
catch(err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
}
