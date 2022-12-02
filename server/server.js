const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const {
  generateMessage,
  generateLocationMessage,
  generateLocationRoute,
} = require("./utils/message");

const publicPath = path.join(__dirname, "../public");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

const PORT = process.env.PORT || 3000;

let interval;

const getApiAndEmit = (socket,coords) => {
  //const response = new Date();

  // Emitting a new message. Will be consumed by the client
  //socket.emit("FromAPI", response);

   socket.emit(
      "util",
      "YES"
    );
};

io.on("connection", (socket) => {
  console.log("NEW USER CONNECTED");
  if (interval) {
    clearInterval(interval);
  }
  //interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("USER WAS DISCONNECTED");
    clearInterval(interval);
  });

  // socket.emit from Admin to user
  socket.emit(
    "newMessage",
    generateMessage("Admin", "Welcome to the My app")
  );

  // socket.broadcast.emit from Admin to other users
  socket.broadcast.emit(
    "newMessage",
    generateMessage("Admin", "New user joined")
  );

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    // send message from a browser to server and all users including me
    // will be able to see it
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback("This is from server"); //call back to client one time

    // broadcast message to other users, I cant see it
    // socket.broadcast.emit("newMessage", {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime(),
    // });
  });

  socket.on("createLocation", (message) => {
    io.emit("newRoute", generateLocationRoute(message.from, message.text));
  });

  // https://www.google.com/maps?q=latitude,longitude
  // socket.on("createLocationMessage", (coords) => {
  //   io.emit(
  //     "newMessage",
  //     generateMessage("Admin", `${coords.latitude}, ${coords.longitude}`)
  //   );
  // });

  socket.on("createLocationMessage", (coords) => {
    console.log("server get location","SUCCESS!!!")
    io.emit(
      "newLocationMessageRealTime",
      generateLocationMessage("GET LOCATION", coords.latitude, coords.longitude)
    );
  });

  socket.on("createLocationMessageRealTime", (message) => {
    console.log("SERVER IS GETTING LOCATION",message);
    interval = setInterval(() => getApiAndEmit(socket), 3000);
    // io.emit(
    //   "newLocationMessage",
    //   generateLocationMessage("Admin", coords.latitude, coords.longitude)
    // );
  });
});

server.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
