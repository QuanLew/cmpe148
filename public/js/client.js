var socket = io();

socket.on("connect", function () {
  console.log("Connected to server.");
});

socket.on("disconnect", function () {
  console.log("Disconnected to server.");
});

// new event listener
socket.on("newMessage", function (message) {
  console.log("newMessage", message);

  var li = jQuery("<li></li>");
  li.text(`${message.from}: ${message.text}`);

  jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function (message) {
  console.log("new location: ", message);

  // var li = jQuery("<li></li>");
  // var a = jQuery('<a target="_blank">My current location</a>');

  // li.text(`${message.from}: `);
  // //li.css("color", "green");
  // a.attr("href", message.url);
  // li.append(a);

  // jQuery("#messages").append(li);

  var div = jQuery("<div></div>");
  div.css("width", "500px");
  div.css("height", "500px");
  div.googleMap({
    zoom: 10, // Initial zoom level (optional)
    //coords: [37.2929515, -121.8553376], // Map center (optional)
    type: "ROADMAP", // Map type (optional)
  });
  var lat = `${message.lat}`;
  var long = `${message.long}`;
  div.addMarker({
    coords: [lat, long], // GPS coords
    url: `${message.url}`, // Link to redirect onclick (optional)
    id: "marker1", // Unique ID for your marker
  });
  div.addWay({
    start: "1520 E Capitol Expy, San Jose, CA, 95121", // Postal address for the start marker (obligatory)
    end: [lat, long], // Postal Address or GPS coordinates for the end marker (obligatory)
    route: "way", // Block's ID for the route display (optional)
    langage: "english", // language of the route detail (optional)
  });
  jQuery("#map").append(div);
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
