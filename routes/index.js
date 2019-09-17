var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){ //root route
    res.render("home");
});

//AUTH ROUTES

//Show register form
router.get("/register", function(req, res){
  res.render("register");
})

//Signup logic
router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, function(err, user){
    if (err){
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/dungeons");
    })
  });
});

//Show login form
router.get("/login", function(req, res){
  res.render("login");
})

//Login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dungeons",
  failureRedirect: "/login"
}));

//Logout
router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/dungeons")
})

//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
