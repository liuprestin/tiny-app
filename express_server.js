const https = require("https");
const fs = require("fs");

const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

const { generateRandomString } = require("./helper/util.js");
const {
  userEmailSearch,
  getUserByEmail,
  userPasswordCheck,
} = require("./helper/usersUtil.js");

const {
  urlsForUser,
  addNewUrl,
  deleteUrl,
  updateUrl,
} = require("./helper/urldbUtil.js");

const morgan = require("morgan");


const app = express();

//network and https configuration
const PORT = 8080;
const options = {
  key: fs.readFileSync("./setup/testKey.pem"),
  cert: fs.readFileSync("./setup/testCert.pem"),
};

//for development only
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["1"],
    secure: false,

    maxAge: 2 * 60 * 60 * 1000, // 2 hours session span
  })
);

const urlDatabase = {};

const users = {};

//Homepage
app.get("/", (req, res) => {
  res.redirect("/login");
});

//Registration
app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls/");
  }

  const id = req.session.user_id;

  const templateVars = {
    user_id: id,
    email: "no@email.com",
  };

  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  const id = generateRandomString();

  //cannot have empty string
  if (!email || !password) {
    res.status(400).end("<p>Email and password cannot be blank</p>");
    return;
  }
  // needs to check if the email exists
  if (userEmailSearch(users, email)) {
    res.status(400).end(`<p> ${email} already exists </p>`);
    return;
  }

  const salt = bcrypt.genSaltSync();
  //the server stores hashed passwords
  const hashedPassword = bcrypt.hashSync(password, salt);

  users[id] = { id, email, password: hashedPassword };
  req.session.user_id = id;

  res.redirect(`/urls/`);
});

//LOGIN
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls/");
  }

  const id = req.session.user_id;

  const templateVars = {
    user_id: id,
  };

  res.render("login", templateVars);
});

//needs cleanup --> this doesn't make sense
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //cannot have empty string
  if (!email || !password) {
    res.status(400).end("<p>Email and password cannot be blank</p>");
    return;
  }
  // needs to check if the email exists
  if (!userEmailSearch(users, email)) {
    res.status(403).end(`<p> ${email} does not exist please register </p>`);
    return;
  }

  const id = getUserByEmail(users, email);
  if (!userPasswordCheck(users, id, email, password)) {
    res.status(403).end(`<p> ${email} and/or ${password} do not match </p>`);
    return;
  }

  req.session.user_id = id;

  res.redirect(`/urls/`);
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

// Handle URLs
app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.send(`<p> You must be logged in to shorten URLs </p>`);
    res.redirect(`/login`);
    return;
  }

  const id = req.session.user_id;
  const email = id ? users[id].email : "";

  userUrlDB = urlsForUser(urlDatabase, id);

  const templateVars = {
    user_id: req.session.user_id,
    email,
    urls: userUrlDB,
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.send(`<p> You must be logged in to shorten URLs </p>`);
    res.redirect(`/login`);
    return;
  }
  const id = req.session.user_id;

  userUrlDB = urlsForUser(urlDatabase, id);

  const templateVars = {
    id: req.params.id,
    user_id: req.session.user_id,
    email: users[id].email,
    urls: userUrlDB,
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  if (!req.session.user_id) {
    res.send(`<p> You must be logged in to shorten URLs </p>`);
    res.redirect(`/login`);
    return;
  }

  const id = req.session.user_id;
  userUrlDB = urlsForUser(urlDatabase, id);

  if (!userUrlDB[req.params.id]) {
    res.status(400).end("<p>tiny url id does not exist for this user</p>");
    return;
  }

  const longURLentry = req.params.id ? userUrlDB[req.params.id] : "";

  const templateVars = {
    id: req.params.id,
    user_id: req.session.user_id,
    email: users[id].email, // 3
    longURL: longURLentry,
  };
  res.render("urls_show", templateVars);
});

//Handling the short URLS
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

//Capture a input url for the database
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.send(`<p> You must be logged in to shorten URLs </p>`);
    res.redirect(`/login`);
    return;
  }

  const uniqueID = generateRandomString();

  const id = req.session.user_id;
  userUrlDB = urlsForUser(urlDatabase, id);

  addNewUrl(urlDatabase, uniqueID, req.body.longURL, id);

  res.redirect(`/urls/${uniqueID}`);
});

//delete a url
app.post("/urls/:id/delete", (req, res) => {
  fullUrl = req.url.split("/");
  id = fullUrl[2];
  deleteUrl(urlDatabase, id);

  res.redirect(`/urls/`);
});

//edit a url
app.post("/urls/:id/update", (req, res) => {
  fullUrl = req.url.split("/");
  id = fullUrl[2];

  updatedURL = req.body.updateURL;

  updateUrl(urlDatabase, id, updatedURL);

  res.redirect(`/urls/`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! see the console");
  return;
});

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Tiny Url app listening on port ${PORT}!`);
});
