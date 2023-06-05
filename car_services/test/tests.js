let chai = require("chai");
let chai_http = require("chai-http");
let server = require("../src/app");
var should = chai.should();
let testHelper = require("common_modules/src/util/test_helper");
const mongoose = require("mongoose");

testHelper();
chai.use(chai_http);
mongoose.connect(process.env.DATABASE_LOCAL,).then(conn=>{
  console.log("DB Connected");
}).catch(e=>console.log(e));


describe("Car Operations", () => {
  // Login test
  describe("POST /car", () => {
    it("This should give an error while adding a new car to the database", (done) => {
      chai
        .request(server)
        .post("/car-services/cars")
        .set("headers",{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDVmNjcxNTU2NzgzMDI1NGZjOGUyOWMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE2ODUwMTM1NjgsImV4cCI6MTY4NTE4NjM2OH0.9GgVyPt_FjRkJDviXCBNw5Pi-4CZlRJOVqO2c4gmxtI"})
        .send({ data: "hj" })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.status.should.be.eql(false);
          done();
        });
    });
  });

   describe("POST /car", () => {
    it("This should give an error while adding a new car to the database", (done) => {
      chai
        .request(server)
        .post("/car-services/cars")
        .set("headers",{"Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDVmNjcxNTU2NzgzMDI1NGZjOGUyOWMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE2ODUwMTM1NjgsImV4cCI6MTY4NTE4NjM2OH0.9GgVyPt_FjRkJDviXCBNw5Pi-4CZlRJOVqO2c4gmxtI"})
        .send({
            "carMake": "Honda",
            "carModel": "Civic",
            "variant": "ZX",
            "fuel": "P",
            "engineCC": 1230,
            "transmission": "MANUAL",
            "mileage": 17.3,
            "engineNo": "ASK12312PP1",
            "askPrice": 1500000
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.status.should.be.eql(false);
          done();
        });
    });
  });



});
