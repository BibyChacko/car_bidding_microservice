let chai = require("chai");
let chai_http = require("chai-http");
let server = require("../src/app");
var should = chai.should();
let testHelper = require("@bibybat/common_modules/src/util/test_helper");
const mongoose = require("mongoose");

testHelper();
chai.use(chai_http);
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then((conn) => {
    console.log("DB Connected");
  })
  .catch((e) => console.log(e));

describe("Auth Operations", () => {
  // Login test
  describe("POST /login", () => {
    it("This should provide a validation error for no email and no password", (done) => {
      chai
        .request(server)
        .post("/auth-services/login")
        .send({ data: "hj" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eql(false);
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("This should provide an error for wrong email and password", (done) => {
      chai
        .request(server)
        .post("/auth-services/login")
        .send({
          email: "rohanplu@gmail.com",
          password: "Cplus@1",
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.status.should.be.eql(false);
          done();
        });
    });
  });

  describe("POST /login", () => {
    it("Expecting a success login", (done) => {
      chai
        .request(server)
        .post("/auth-services/login")
        .send({
          email: "rohan@gmail.com",
          password: "Cplus@1",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.be.eql(true);
          res.body.should.have.property("data");
          res.body.should.have.property("token");
          done();
        });
    });
  });
});
