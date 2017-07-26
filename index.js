const http = require("http");
const express = require("express");
const app = express();
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const redis = require("./lib/redisWrapper.js");

const server = http.createServer(app);
const io = require("socket.io")(server);
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io-client/dist/")
);

// server.listen(3000)

// app.use(
//   "/socket-",
//   express.static(__dirname + "node_modules/socket.io-client/dist/")
// );

app.get("/", (req, res) => {
  redis.loadMessages(messages => {
    res.render("index", { messages: messages });
  });
});

// let messageIDs = [1, 2];

io.on("connection", client => {
  console.log("New connection");

  client.on("newMessage", data => {
    var p = redis.saveMessage(data.body, data.author, data.room);

    p.then(() => {
    	console.log("Promise found!");
    	io.emit("updateMessages", data);
    });
  });
});


// redis.saveMessage("Hi there", "me", "main-room");

// function parseMessages = (messageArray){
//   messageArray.forEach((message)=> {
//
//   }
// }

// app.listen(3000, (req, res) => {
//   console.log("listening on port 3000");
// });
server.listen(3000);