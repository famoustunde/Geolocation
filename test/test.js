var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page

  it("should return home page",function(done){

    // calling home page api
    server
    .get("/home")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      res.body.message.should.equal('Welcome to GoZem Test API ');
      // Error key should be false.
      res.body.error.should.equal(false);
      done();
    });
  });

  // #2 should return home page
  it("should return 404",function(done){
    server
    .get("/random")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  })

});

describe("/api/get_distance_and_time", () => {
  let body = {
    start: { lat: 33.58831, lng: -7.61138 },
    end: { lat: 35.6895, lng: 139.69171 },
    units: "metric"
  };

  let start = {
    country: "Morocco",
    timezone: "GMT+1",
    location: { lat: 33.58831, lng: -7.61138 }
  };
  
  let end = {
    country: "Japan",
    timezone: "GMT+9",
    location: { lat: 35.6895, lng: 139.69171 }
    
  };
  
  let distance = {
    value: 11593,
    units: "km"
    
  };
  
  let time_diff = {
    value: 8,
    units: "hours"
  };
    

  it("Get distance and time", done => {
    server
    .post("/api/get_distance_and_time")
    .set('content-type', 'application/json')
    .send(body)
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      // res.body.start.to.be(start);
      // res.body.end.to.be(end);
      // res.body.distance.to.be(distance);
      // res.body.time_diff.to.be(time_diff);
      done();
    });
  });
});