var express = require("express");
var app= express();
var bodyParser= require("body-parser");
var mongoose = require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStrategy= require("passport-local");
var methodOverride=require("method-override");
var Campground = require("./models/campgrounds.js");
var Comment= require("./models/comments.js");
var User = require("./models/user");
var seedDB=require("./seeds.js");
//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://akhilbhartia:password@cluster0.xpkjl.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
	console.log("connected to db");
	
}).catch(err =>{
	console.log("error:", err.message);
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seed the data base
// seedDB();

//passport cofiguration
app.use(require("express-session")({
	secret:"life is good",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error= req.flash("error");	
	res.locals.success= req.flash("success");

	next();
});
app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(port, function () {
  console.log("Server Has Started!");
});