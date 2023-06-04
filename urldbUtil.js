// utility Functions specific to the 
// urlDatabase object present in express_server.js
// note: this version of these functions 
// assume that the database urlDatabase is global and 
// is not affected by the userSession.

//Add a url to the database
function addNewUrl(collection, tinyURL, longURL, user_id){
  collection[tinyURL] = { longURL, user_id };
  return;
}  

//delete a url and all properties in the urldatabase
function deleteUrl(collection, tinyURL ){
 delete collection[tinyURL];
 return; 
}

//update a url given the tinyURL and updatedURL
function updateUrl(collection, tinyURL, updateURL){
  collection[tinyURL].longURL = updateURL;
  return; 
}

/*
Given the urlDatabase 
return an  object with the current 
collection of urls associated to a user session

the function will return something similar to:

{
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
}
*/
function urlsForUser(collection, user_id){
  let userURLs = {};

  if(Object.keys(collection).length == 0){
    return {};
  }

  for (let [key, value] of Object.entries(collection)) {
     if(collection[key].userID == user_id){
      userURLs[key] = collection[key].longURL;
     }
  }
  return userURLs;
}

module.exports = { urlsForUser, addNewUrl, deleteUrl, updateUrl };