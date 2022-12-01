var expect = require("expect");

var { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    // store res in var
    var from = "Minh";
    var text = "Some message";
    var message = generateMessage(from, text);
    // assert from match
    // assert text match
    // assert createdAt is number
    expect(message.createdAt).toBeA("number");
    expect(message).toInclude({
      from,
      text,
    });
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    var from = "M";
    var latitude = 15;
    var longitude = 29;
    var url = `https://www.google.com/map?q=15,29`;
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message.createAt).toBeA("number");
    expect(message).toInclude({
      from,
      url,
    });
  });
});
