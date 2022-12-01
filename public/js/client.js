var socket = io();

socket.on("connect", function () {
  console.log("Connected to server.");

  // socket.emit("createEmail", {
  //   to: "m@gmail.com",
  //   text: "Hey, I am Minh",
  // });

  // socket.emit("createMessage", {
  //   from: "Minh",
  //   text: "Got that message.",
  // });
});

socket.on("disconnect", function () {
  console.log("Disconnected to server.");
});

// socket.on("newEmail", function (email) {
//   console.log("New Email!!!", email);
// });

// new event listener
socket.on("newMessage", function (message) {
  console.log("newMessage", message);

  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function (message) {
  console.log("new location: ", message);
  var li = jQuery("<li></li>");
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr("href", message.url);
  li.append(a);

  jQuery("#messages").append(li);
});

//get button from id: message-form and send a event message to server
//with function createMessage
jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();

  socket.emit(
    "createMessage",
    {
      from: "USER",
      text: jQuery("[name=message]").val(),
    },
    function () {}
  );
});

//get button with id: send-location and open socket
var locationBtn = jQuery("#send-location");
locationBtn.on("click", function () {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      alert("Unable to fetch location");
    }
  );
});

// socket.emit(
//   "createMessage",
//   {
//     from: "JOHN",
//     text: "Hi",
//   },
//   //call back function
//   function (data) {
//     console.log("GOT IT", data);
//   }
// );
