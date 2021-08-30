//jshint esversion:6
require('dotenv').config();
const express =require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const encrypt = require("mongoose-encryption");


const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/secretDB", ({useNewUrlParser: true}));


// Schema and plugins
const secretsSchema = new mongoose.Schema({
  email: String,
  password: String
})

secretsSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });


const Secret = new mongoose.model("Secret", secretsSchema);
// Schema and plugins

const userDataSchema = new mongoose.Schema({
  email: String,
  password: String
})
const UserData = new mongoose.model("UserData", userDataSchema);
console.log(process.env.API_KEY);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  res.render("home");
})

app.route("/login")
.get(function(req, res) {
  res.render("login");
})

.post(function(req, res) {
    Secret.findOne({email: req.body.username}, function(err, foundUser) {
        console.log(foundUser.password);
          if (!err) {
          if(foundUser.password === req.body.password) {
            res.render("secrets");
          } else (
            res.send("error")
          )
        }
      })

})


app.route("/register")
.get(function(req, res) {
  res.render("register");
})
.post(function(req, res) {
  const secret = new Secret({
    email: req.body.username,
    password: req.body.password
  })
  secret.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }

  });

})










app.listen("3000", function() {
  console.log("Server is running on port 3000.");
})
