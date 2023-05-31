const express = require("express");
const { generateRandomString } = require("./util.js");
const app = express();
const PORT = 8080; // default port 8080

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// add body parser?

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

//FIXME: remove the test values
let urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//FIXME: remove the test values
// users[].email
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//Homepage
app.get("/", (req, res) => {
  res.send("Hello!");
});

//Registration
app.get("/register", (req, res) => {
  let id = req.cookies["user_id"];
  let email;
  let templateVars = {
    user_id: req.cookies["user_id"],
    email: "test@email.com",
  };
  
  
  res.render("register", templateVars);
});
app.post("/register", (req, res) => {
  let {email, password} = req.body;
  id = generateRandomString();
  
  users[id] = {id, email, password};

  //cannot have empty string
  if(!email || !password){
    res.status(400).end("<p>Email and password cannot be blank</p>");
  }
  // needs to check if the email exists 

  res.cookie(`user_id`, id);

  res.redirect(`/urls/`);
});

//LOGIN
app.get("/login", (req, res) => {
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/urls/`);
});

//needs cleanup --> this doesn't make sense 
app.post("/login", (req, res) => {

  res.redirect(`/urls/`);
});

// Handle URLs
app.get("/urls", (req, res) => {
console.log("users", users);

if(!req.cookies["user_id"]){
  res.send("Not logged in");
}

let user_id = req.cookies["user_id"];


  const templateVars = {
    user_id: req.cookies["user_id"],
    email: users[id].email, // 1
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  if(!req.cookies["user_id"]){
    res.send("Not logged in");
  }
  let id = req.cookies["user_id"];
  
  const templateVars = {
    user_id: req.cookies["user_id"],
    email: users[id].email,
    urls: urlDatabase,
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if(!req.cookies["user_id"]){
    res.send("Not logged in");
  }
  
  let id = req.cookies["user_id"];

  const templateVars = {
    id: req.params.id,
    email: users[id].email, // 3
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

//Handling the short URLS
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//Capture a input url for the database
app.post("/urls", (req, res) => {
  let uniqueID = generateRandomString();
  urlDatabase[uniqueID] = req.body.longURL;
  res.redirect(`/urls/${uniqueID}`);
});

//delete a url
app.post("/urls/:id/delete", (req, res) => {
  fullUrl = req.url.split("/");
  id = fullUrl[2];
  delete urlDatabase[id];

  res.redirect(`/urls/`);
});

//edit a url
app.post("/urls/:id/update", (req, res) => {
  fullUrl = req.url.split("/");
  id = fullUrl[2];

  updateURL = req.body.updateURL;

  urlDatabase[id] = updateURL;

  res.redirect(`/urls/`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Tiny Url app listening on port ${PORT}!`);
});
