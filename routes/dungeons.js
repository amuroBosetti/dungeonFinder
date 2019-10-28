var express = require("express");
var router = express.Router();
var Dungeon = require("../models/dungeon");
var comment = require("../models/comment");

//INDEX - Muestra una lista de todas las dungeons
router.get("/", function(req, res){ //page that lists every dungeon
    Dungeon.find({}, function(err, allDungeons){
        if(err){
            console.log(err);
        } else {
           res.render("dungeons/index", {dungeons:allDungeons});
        }
    })
});

//NEW - Muestra el formulario para crear una nueva dungeon
router.get("/new",isLoggedIn, function(req, res) {
    res.render("dungeons/new");
})

//CREATE - Añadir una nueva dungeon
router.post("/",isLoggedIn, function(req, res){
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //add to dungeons db
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newDungeon = {name: name, image: image, description: desc, author: author};
    Dungeon.create(newDungeon, function(err, dungeon){
        if(err){
            console.log(err);
        } else {
            res.redirect("/dungeons");
        }
    });
});

//SHOW - Muestra información sobre una dungeon
router.get("/:id", function(req, res) {
    Dungeon.findById(req.params.id).populate("comments").exec(function(err, foundDungeon){
        if(err){
            console.log(err);
        } else {
            // console.log(foundDungeon);
            res.render("dungeons/show", {dungeon: foundDungeon});
        }
    });
});

//EDIT
router.get("/:id/edit", function(req, res){
  Dungeon.findById(req.params.id, function(err, foundDungeon) {
    if (err){
      res.redirect("/dungeons");
    }
    res.render("dungeons/edit", {dungeon: foundDungeon});
  });
});
//UPDATE
router.put("/:id", function(req, res){
  Dungeon.findByIdAndUpdate(req.params.id, req.body.dungeon, function (err, updatedDungeon) {
    if(err){
      res.redirect("/dungeons");
    }
      res.redirect("/dungeons/" + req.params.id);
  })
})


//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
