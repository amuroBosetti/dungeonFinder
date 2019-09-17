var express = require("express");
var router = express.Router({mergeParams: true});
var Dungeon = require("../models/dungeon");
var comment = require("../models/comment");

// COMMENTS //
router.get("/new",isLoggedIn, function(req, res){
  //find dungeon by id
  Dungeon.findById(req.params.id, function(err, dungeon){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {dungeon: dungeon});
    }
  });
})

router.post('/',isLoggedIn, function(req, res){
  //find dungeon by id
  Dungeon.findById(req.params.id, function(err, dungeon){
    if(err){
      console.log(err);
      res.redirect("/dungeons");
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          console.log(err);
        } else {
          //connect new comment to dungeon
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //add username and id to comment
          dungeon.comments.push(comment);
          dungeon.save();
          //redirect to dungeon show page
          res.redirect("/dungeons/" + dungeon._id);
        }
      });
    }
  });
});

//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
