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

var globalLat = 0;
var globalLong = 0;

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

  globalLat = lat;
  globalLong = long;

  div.addMarker({
    coords: [lat, long], // GPS coords
    url: `${message.url}`, // Link to redirect onclick (optional)
    id: "marker1", // Unique ID for your marker
  });
  jQuery("#map").append(div);
});

// new event listener find route
// (KING LIBS) 150 E San Fernando St, San Jose, CA 95112
socket.on("newRoute", function (message) {
  var div = jQuery("<div></div>");
  div.css("width", "500px");
  div.css("height", "500px");
  div.googleMap({
    zoom: 20, // Initial zoom level (optional)
    //coords: [37.2929515, -121.8553376], // Map center (optional)
    type: "HYBRID", // Map type (optional)
  });

  div.addMarker({
    coords: [globalLat, globalLong], // GPS coords
    id: "route1", // Unique ID for your marker
  });
  div.addWay({
    start: `${message.stress}`, // Postal address for the start marker (obligatory)
    end: [globalLat, globalLong], // Postal Address or GPS coordinates for the end marker (obligatory)
    route: "way", // Block's ID for the route display (optional)
    langage: "english", // language of the route detail (optional)
  });

  var stress = `${message.stress}`;
  console.log("srtess: ", stress.length);
  if ((globalLat == 0 && globalLong == 0) || stress.length < 1) {
    alert("Location is null. Check your location or your input");
  } else {
    jQuery("#map").remove();
    //jQuery("#map1").append(div);
    $.ajax({
      url: "http://localhost:3000/",
      cache: false,
    }).done(function (html) {
      $("#map1").empty().append(div);
    });
  }
});

//function find route
//get button from id: message-form and send a event message to server
//with function createMessage
jQuery("#message-form").on("submit", function (e) {
  e.preventDefault();

  // socket.emit(
  //   "createMessage",
  //   {
  //     from: "USER",
  //     text: jQuery("[name=message]").val(),
  //   },
  //   function () {}
  // );

  socket.emit(
    "createLocation",
    {
      from: "YOUR FRIENDS",
      text: jQuery("[name=message]").val(),
    },
    function () {}
  );
});

//function get location
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
