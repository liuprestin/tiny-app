//Utility functions for the users database object

const bcrypt = require("bcryptjs");

//utility function to traverse through the user object (see express_server.js)
// and check if the given email is present
// will return true or false
function userEmailSearch(collection, email) {
  for (let [key, value] of Object.entries(collection)) {
    if (collection[key].email == email) {
      return true;
    }
  }
  return false;
}

//utility function to traverse through the user object (see express_server.js)
// and verify that the email/password match
// will return true or false
// requires the user ID
function userPasswordCheck(collection, id, email, password) {
  if (!collection[id]) {
    return false; //user does not exist
  }
  console.log(collection[id]);
  console.log(password, collection[id].password);
  console.log(bcrypt.compareSync(password, collection[id].password));
  if ( collection[id].email == email && bcrypt.compareSync(password, collection[id].password))
   {
    return true;
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
        console.log(collection[key].id);
      return collection[key].id;
    }
  }
  return "";
}

module.exports = { userEmailSearch, userPasswordCheck, getUserByEmail };
