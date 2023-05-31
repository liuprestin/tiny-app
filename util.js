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

module.exports = { generateRandomString, userEmailSearch };
