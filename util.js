const bcrypt = require("bcryptjs");

//utility function to generate a random string
// right now the function has a hard coded length
function generateRandomString() {
  return Math.random().toString(20).substring(2, 15);
}

//utility function to traverse through the user object (see express_server.js)
// and check if the given email is present
// will return true or false
function userEmailSearch(collection, email) {
  for (let [key, value] of Object.entries(collection)) {
    console.log(collection[key].email);
    if (collection[key].email == email) {
      return true;
    }
  }
  return false;
}

//utility function to traverse through the user object (see express_server.js)
// and verify that the email/password match 
// will return true or false

//note: may need bcrypt to decrypt passwords
// bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword); // returns true
// bcrypt.compareSync("pink-donkey-minotaur", hashedPassword); // returns false
function userPasswordCheck(collection, email, password) {
  for (let [key, value] of Object.entries(collection)) {
    console.log(collection[key].email);
    if (collection[key].email == email && bcrypt.compareSync(password, collection[key].password)) {
      return true;
    }
  }
  return false;
}

// Given an email , search the Users collection object 
// for the user id.
// returns the user id if present
// otherwise returns empty string 
function getUserByEmail(collection, email) {
  for (let [key, value] of Object.entries(collection)) {
    
    if (collection[key].email == email) {
      return collection[key].id;
    }
  }
  return "";
}

// Will need some utility functions for the url database --> at this point it maybe a better 
// idea to split the utility functions into seperate cases: general, users_utility, urls_utility 

module.exports = { generateRandomString, userEmailSearch, userPasswordCheck, getUserByEmail };
