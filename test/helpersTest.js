//test util.js, utilDB.js and usersUtil.js

const { assert } = require('chai');

const { getUserByEmail } = require('../helper/usersUtil.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('Function should return a user id given a valid email', function() {
    const result = getUserByEmail(testUsers, "user@example.com");
    assert.equal(result, "userRandomID");
  });

  it('Function should return an empty string if given incorrect email', function() {
    const result = getUserByEmail(testUsers, "invalid@example.com");
    assert.equal(result, "");
  });
});
