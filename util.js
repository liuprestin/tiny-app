//utility function to generate a random string 
// right now the function has a hard coded length
function generateRandomString(){
    return Math.random().toString(20).substring(2, 15);
}

module.exports = { generateRandomString };