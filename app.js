var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    port        = process.env.PORT || 3000,
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Dungeon     = require("./models/dungeon");
    User        = require("./models/user");
    Comment     = require("./models/comment");
    seedDB      = require("./seeds");
    commentRoutes = require("./routes/comments");
    dungeonRoutes = require("./routes/dungeons");
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/dungeonfinder", { useNewUrlParser: true, useCreateIndex: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); //set the default type of file for templates to ejs

 // seedDB();

//CONFIGURACIÓN DE PASSPORT
app.use(require("express-session")({
  secret: "not the real thing lol",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user; //la variable currentUser va a ser req.user siempre
  next();
})

app.use(indexRoutes);
app.use("/dungeons/:id/comments", commentRoutes);
app.use("/dungeons", dungeonRoutes);

app.listen(port, function(){
    console.log("Server started");
});
