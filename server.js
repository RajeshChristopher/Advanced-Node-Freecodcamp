'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

const routes = require("./routes.js");

const auth = require("./auth.js");

const app = express();

app.set("view engine","pug");

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false}
}))

var passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());



myDB(async function (client){
  const myDataBase = await client.db("Advanced-node-db").collection("Advanced-node-db-collection");

  

  routes(app, myDataBase);

  auth(app, myDataBase)







  
}).catch(function e(){
  app.route("/").get(function(req,res){
    res.render("pug",{
      title: "e",
      message: "Unable to login"
    });
  });
});

//passport.serializeUser(function(user,done){
  //done(null,user._id);
//});

//passport.deserializeUser(function(id,done){
 // myDB.findOne({_id: new ObjectID(id)},function(err,doc){
 //   done(null,null);
 // });
//});



//app.route('/').get((req, res) => {
  //res.render(__dirname + '/views/pug/index.pug',{title: "Hello",message: "Please login"});
//});









const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
