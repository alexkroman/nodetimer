server = require('../server.js')
jasmine = require('jasmine-node')

it("should respond with 200", function(done) {
  request("http://localhost:3000/login", function(error, response, body){
    expect(body).toMatch(/login/);
    done();
  });
});
