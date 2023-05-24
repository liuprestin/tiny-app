const express = require("express");
const { generateRandomString } = require("./util.js");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.status(200); // Respond with 'Ok' (we will replace this)
  res.send("200");
});

app.post("/urls/new", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.on('finish', () => {
    const {key , value } = req.body;
    urlDatabase[generateRandomString()] = value;
    console.log(urlDatabase);

  });
  
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
