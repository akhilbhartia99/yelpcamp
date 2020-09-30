var express= require("express");
var router=express.Router();
var Campground= require("../models/campgrounds");
var Comment= require("../models/comments");
var middleware=require("../middleware/index.js")


//index route

router.get("/",function(req,res){
	
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index.ejs",{campgrounds:allCampgrounds, currentUser: req.user});
		}
	})
	
	
});
//create route
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id: req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,price:price,image:image,description:desc,author:author};
	
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err)
		}else{
			res.redirect("/campgrounds");
		}
	});
	

});
//new route
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new.ejs");
});
//show route
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show.ejs",{campground: foundCampground});
		}
	});
	
});
//edit campgroundroute
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
		   Campground.findById(req.params.id, function(err,foundCampground){
			   
			   res.render("campgrounds/edit.ejs", {campground:foundCampground});
			   		   
			   });
		   
	
	});
	
//update campgroundroute
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	} );
});
//destroy campground route

router.delete("/:id", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});




module.exports=router;