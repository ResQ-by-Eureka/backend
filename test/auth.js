const expect = require("chai").expect;
const request = require("request");
require("dotenv").config();
const PORT = process.env.PORT;
const url = `http://localhost:${PORT}/auth`;

describe("Authentication", () => {
  it("Body", function (done) {
    request(url, (error, response, body) => {
      expect(body).to.equal("Welcome to Salva");
      done();
    });
  });
});
