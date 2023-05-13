const expect = require("chai").expect;
const request = require("request");
require("dotenv").config();
const PORT = process.env.PORT;
const url = `http://localhost:${PORT}/`;

describe("Main Page", () => {
  it("Body", function (done) {
    request(url, (error, response, body) => {
      console.log(body);
      expect(body).to.equal("Welcome to Salva");
      done();
    });
  });

  it("Response Code", (done) => {
    request(url, (err, resp, body) => {
      expect(resp.statusCode).to.equal(200);
      done();
    });
  });
});
