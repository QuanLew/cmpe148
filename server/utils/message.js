var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime(),
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    lat: latitude,
    long: longitude,
    createAt: new Date().toLocaleTimeString(),
  };
};

var generateLocationRoute = (from, name) => {
  return {
    from,
    stress: name,
    createAt: new Date().toLocaleTimeString(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
  generateLocationRoute,
};
