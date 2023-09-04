let chai = require("chai");
let chai_http = require("chai-http");
let server = require("../src/app");
var should = chai.should();
let testHelper = require("common_modules/src/util/test_helper");
const mongoose = require("mongoose");

testHelper();
chai.use(chai_http);
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then((conn) => {
    console.log("DB Connected");
  })
  .catch((e) => console.log(e));

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NDVmNjcxNTU2NzgzMDI1NGZjOGUyOWMiLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE2OTM4MzUxODgsImV4cCI6MTY5NDAwNzk4OH0.WHnGR0PkVTmJtU_Ec60jAAYCIVYSo2PmujqDS_mEtX8";

// describe("Car Adding", () => {
//   // Login test
//   describe("POST /car", () => {
//     it("This should give an 400 error while adding a new car to the database as there aren't necessary params", (done) => {
//       chai
//         .request(server)
//         .post("/car-services/cars")
//         .set({ "Authorization": `Bearer ${token}` })
//         .send({ data: "hj" })
//         .end((err, res) => {
//           res.should.have.status(400);
//           res.body.status.should.be.eql(false);
//           done();
//         });
//     });
//   });

//   describe("POST /car", () => {
//     it("This should give an 401 error while adding a new car to the database", (done) => {
//       chai
//         .request(server)
//         .post("/car-services/cars")
//         .set({ "Authorization": `Bearer kj` })
//         .send({
//           carMake: "Honda",
//           carModel: "Civic",
//           variant: "ZX",
//           fuel: "P",
//           engineCC: 1230,
//           transmission: "MANUAL",
//           mileage: 17.3,
//           engineNo: "ASK123872PP1",
//           askPrice: 1500000,
//         })
//         .end((err, res) => {
//           res.should.have.status(401);
//           res.body.status.should.be.eql(false);
//           done();
//         });
//     });
//   });

//   describe("POST /car", () => {
//     it("This should give a 200 error while adding a new car to the database as ", (done) => {
//       chai
//         .request(server)
//         .post("/car-services/cars")
//         .set({ "Authorization": `Bearer ${token}` })
//         .send({
//           carMake: "Maruti Suzuki",
//           carModel: "Swift",
//           variant: "ZX",
//           fuel: "P",
//           engineCC: 1230,
//           transmission: "MANUAL",
//           mileage: 17.3,
//           engineNo: "ghhghjgh5656",
//           askPrice: 1500000,
//         })
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.status.should.be.eql(true);
//           done();
//         });
//     });
//   });
// });


describe("Fetching cars", () => {

  describe("GET /car", () => {
    it("This should give a 401, when token is missing or illformed", (done) => {
      chai
        .request(server)
        .post("/car-services/cars")
        .set({ "Authorization": `Bearer ` })

        .end((err, res) => {
          res.should.have.status(401);
          res.body.status.should.be.eql(false);
          done();
        });
    });
  });

  describe("GET /car", () => {
    it("This should fech all cars in db smoothly ", (done) => {
      chai
        .request(server)
        .get("/car-services/cars")
        .set({ "Authorization": `Bearer ${token}` })
      
        .end((err, res) => {
          res.should.have.status(200);
          res.body.status.should.be.eql(true);
          res.body.data.length.should.be.gt(0);
          done();
        });
    });
  });
});
