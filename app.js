var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    port        = process.env.PORT || 3000,
    flash         = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Dungeon     = require("./models/dungeon"),
    User        = require("./models/user"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds"),
    commentRoutes = require("./routes/comments"),
    dungeonRoutes = require("./routes/dungeons"),
    indexRoutes = require("./routes/index"),
    methodOverride = require("method-override");

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs"); //set the default type of file for templates to ejs
app.use(flash());
app.use(methodOverride("_method"));
app.use('/stylesheets/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use(indexRoutes);
app.use("/dungeons/:id/comments", commentRoutes);
app.use("/dungeons", dungeonRoutes);

app.listen(port, function(){
    console.log("Server started");
});
