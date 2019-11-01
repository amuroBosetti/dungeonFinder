var express = require("express");
var router = express.Router({mergeParams: true});
var Dungeon = require("../models/dungeon");
var Comment = require("../models/comment");
var middleware = require ("../middleware");

// COMMENTS //
router.get("/new",middleware.isLoggedIn, function(req, res){
  //find dungeon by id
  Dungeon.findById(req.params.id, function(err, dungeon){
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {dungeon: dungeon});
    }
  });
})

//CREATE
router.post('/',middleware.isLoggedIn, function(req, res){
  //find dungeon by id
  Dungeon.findById(req.params.id, function(err, dungeon){
    if(err){
      console.log(err);
      res.redirect("/dungeons");
    } else {
      //create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          //connect new comment to dungeon
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          //add username and id to comment
          dungeon.comments.push(comment);
          dungeon.save();
          req.flash("success", "Successfully added comment")
          //redirect to dungeon show page
          res.redirect("/dungeons/" + dungeon._id);
        }
      });
    }
  });
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  Dungeon.findById(req.params.id, function(err, foundDungeon){
    if(err || !foundDungeon){
      req.flash("error", "Dungeon not found");
      return res.redirect("back");
    }
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err){
        res.redirect("back");
      } else{
        res.render("comments/edit", {dungeon_id: req.params.id, comment: foundComment});
      }
    });
  });


})
//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
    if(err){
      res.redirect("back");
    }
      res.redirect("/dungeons/" + req.params.id);
  })
})

//DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err){
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/dungeons/" + req.params.id);
    }
  })
})

module.exports = router;
