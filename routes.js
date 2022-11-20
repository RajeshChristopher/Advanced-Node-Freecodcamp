
var passport = require("passport");

const bcrypt = require('bcrypt');

module.exports = function(app, myDataBase) {

  app.route("/").get(function(req, res) {
    res.render("pug", {
      title: "Connected to database",
      message: "Please login",
      showLogin: true,
      showRegistration: true,
      showSocialAuth: true
    });
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next;
    }
    else {
      res.redirect("/");
    }
  };

  app.route("/login").post(passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/profile");
  });

  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    res.render(__dirname + 'views/pug/profile.pug', { username: req.user.username });
  });

  app.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/");
  });



  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

  app.route("/register").post((req, res, next) => {
    myDataBase.findOne({ username: req.body.username }, function(err, user) {
      const hash = bcrypt.hashSync(req.body.password, 12);
      if (err) {
        next(err);
      } else if (user) {
        res.redirect("/");
      } else {
        myDataBase.insertOne(
          {
            username: req.body.username,
            password: hash
          },
          function(err, doc) {
            if (err) {
              res.redirect("/");
            } else {
              next(null, doc.ops[0]);
            }
          }
        )
      }
    }
    )
  },
    passport.authenticate("local", { failureRedirect: "/" }), function(req, res) {
      res.redirect("/profile");
    }
  );

  app.route("/auth/github").get(passport.authenticate("github"));

app.route("/auth/github/callback").get(passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
  req.session.user_id = req.user.id;
  res.redirect("/chat");
});



}

