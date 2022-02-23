const Express = require("express");
const app = Express(); 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth/auth");
const allRoutes = require("./routes/all/all");
const Channel = require("./models/channel");l
require('dotenv').config()

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });


app.use(authRoutes);
app.use(allRoutes);
//error handler
app.use((error, req, res, next) => {
  
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.zabr4.mongodb.net/${process.env.DBNAME}e`)
.then(res=>{
    console.log("database connected !");
    
    const server = app.listen(process.env.PORT,()=>{
        console.log("server listenning on port:",process.env.PORT);
    })
    const io = require("socket.io")(server);
        io.on("connection",(socket)=>{
          
          socket.on('join', (data) => {
           
            socket.join(data.channelId, () => {
              
              socket.to(data.channelId).broadcast.emit('user-connected', data.un)
              socket.on('disconnect',()=>{
                socket.to(data.roomId).broadcast.emit('user-disconnected', data.un)
              })

            });
        
            socket.on('send message', (data) => {
              
              
                Channel.findOne({_id : data.channelId}).then(channel=>{
                  const msg = {
                    senderId : data.userId.toString(),
                    senderUsername: data.username,
                    message: data.message,
                    date : new Date()
                  }
                  
                  channel.chat.push(msg);
                  io.to(data.channelId).emit('new message',msg)
                  return channel.save();

                })
                
            });
            
            

        });
        })
    

}).catch(err=>{
    console.log(err);
})


