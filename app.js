require("dotenv").config();
const express = require("express");
const mongoose=require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }))

var Chats = mongoose.model("Chats", {

    name: String,

    chat: String

});

mongoose.connect(process.env.DBURL ,{useNewUrlParser:true}, (err) => { 
    if(err){
        console.log(err)
    } else
        console.log("mongoDB connected");
});


var http = require("http").Server(app)

var io= require("socket.io")(http)
io.on("connection", (socket) => {

    console.log("Socket is connected...")

})

app.post("/chats", async (req, res) => {

    try {
   
    var chat = new Chats(req.body)
   
    await chat.save()
   
    res.sendStatus(200)
   
    //Emit the event
   console.log(req.body)
    io.emit("chat", req.body)
   
    } catch (error) {
   
    res.sendStatus(500)
   
    console.error(error)
   
    }
   
   });

app.get("/chats", (req, res) => {

    Chats.find({}, (error, chats) => {

        res.send(chats)

    });

});



// let server = app.listen(process.env.PORT || 3000, () => {
//     console.log("server is running on port", server.address().port);
// });


server = http.listen(3000, () => {

    console.log("I am listening on ", server.address().port)

})