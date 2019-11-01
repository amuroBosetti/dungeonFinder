var Dungeon = require("../models/dungeon");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You have to be logged in to do that");
  res.redirect("/login");
}

middlewareObj.checkDungeonOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Dungeon.findById(req.params.id, function(err, foundDungeon) {
      if (err || !foundDungeon){
        req.flash("error", "Dungeon not found");
        res.redirect("back");
      } else {
        if(foundDungeon.author.id.equals(req.user._id)){
            next();
        } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        }
      }
    });
  } else {
      req.flash("error", "You have to be logged in to do that");
      res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err || !foundComment){
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)){
            next();
        } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
        }
      }
    });
  } else {
      req.flash("error", "You have to be logged in to do that");
      res.redirect("back");
    }
}

module.exports = middlewareObj;
