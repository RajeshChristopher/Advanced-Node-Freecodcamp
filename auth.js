

var passport = require("passport");


const bcrypt = require('bcrypt');

const ObjectID = require("mongodb").ObjectID;

const LocalStrategy = require("passport-local");

module.exports = function( app, myDataBase){

    passport.serializeUser(function(user,done){
  done(null,user._id);
});

passport.deserializeUser(function(id,done){
  myDB.findOne({_id: new ObjectID(id)},function(err,doc){
    done(null,doc);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  myDataBase.findOne({username: username},function(err,user){
    console.log("User" + username + " tried to login");
    if(err){
      return done(err);
    }
    if(!user){
      return done(null,false);
    }
    //if(password !== user.password){
     // return done(null,false)
    //}
    if(!bcrypt.compareSync(password,user.password)){
      return done(null,false);
    }
    return done(null,user);
  });
}));
  
}
