var Dungeon = require("../models/dungeon");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

middlewareObj.checkDungeonOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Dungeon.findById(req.params.id, function(err, foundDungeon) {
      if (err){
        res.redirect("back");
      } else {
        if(foundDungeon.author.id.equals(req.user._id)){
            next();
        } else {
            res.redirect("back");
        }
      }
    });
  } else {
      res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err){
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)){
            next();
        } else {
            res.redirect("back");
        }
      }
    });
  } else {
      res.redirect("back");
    }
}

module.exports = middlewareObj;
