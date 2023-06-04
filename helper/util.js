//General collection of utility functions 
// for TinyApp url express server 



//utility function to generate a random string
// right now the function has a hard coded length
function generateRandomString() {
  return Math.random().toString(20).substring(2, 15);
}


// Will need some utility functions for the url database --> at this point it maybe a better 
// idea to split the utility functions into seperate cases: general, users_utility, urls_utility 

module.exports = { generateRandomString };
