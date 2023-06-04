//utility Functions specific to the 
// urlDatabase object present in experss_server.js
/*

//looks like we'll need to create some ulitity function for this

// add URLID with {longURL and userID} 

// get longURL if urlID exists  (return url )

// check if if urlID exists? (TF)

// get all URLIDs associated with a userID --> maybe return a array 
// (this will be needed if logging in and needed )


{
  urlID: {
    longURL,
    userID
  }
}
*/

const { generateRandomString } = require("./util.js");


let newURLdb = {
    b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW",
    },
    i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW",
    },
  };
  
function addNewUrl(collection, longURL, user_id){
  
}  
//given a collection return an 
// object with the current collection of urls relative to an id
function urlsForUser(collection, id){

}

module.exports = {};