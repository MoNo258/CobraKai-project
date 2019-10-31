var express     = require("express"),
    router      = express.Router(),
    Sprint      = require("../models/sprint"),
    middleware  = require("../middleware"),
    request     = require("request");



// creation of new sprint anytime server is restarted
// Sprint.create({
//     name: "Sprint4",
//     image: "https://i.ytimg.com/vi/cMJM5_MT8nQ/maxresdefault.jpg",
//     description: "Bla bla bla"
// }, function(err, sprint){
//     if(err){
//         console.log(err)
//     } else {
//         console.log(sprint)
//     }
// });


//INDEX - show all sprints
router.get("/", function(req,res){
    //get all sprints from DB
    Sprint.find({}, function(err, allSprints){
        if (err) {
            console.log(err)
        } else {
            res.render("sprints/index",{sprints: allSprints});
        }
    });
});

//CREATE - add new sprint to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to sprint array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newSprint = {name: name, image: image, description: desc, author: author};
    //create a new sprint and save to DB
    Sprint.create(newSprint, function(err, newlyCreated){
        if(err) {
            console.log(err)
        } else {
            console.log(newlyCreated);
            res.redirect("/sprints");
        }
    });
});


//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("sprints/new");
});

//SHOW - show more info about one sprint
router.get("/:id", function(req, res){
    Sprint.findById(req.params.id).populate("comments").exec(function(err, foundSprint){
        if(err) {
            console.log(err)
        } else {
            // console.log(foundSprint);
            //render show template with that sprint
            res.render("sprints/show", {sprint: foundSprint});
        }
    });
});

//EDIT route
router.get("/:id/edit", middleware.checkUserSprint, function(req, res){
    Sprint.findById(req.params.id, function(err, foundSprint){
        if(err) {
            console.log(err);
        } else {
            //render edit template with that sprint
            res.render("sprints/edit", {sprint: foundSprint});
        }
    });
});

//UPDATE route
router.put("/:id", checkSprintOwnership, function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description};
    Sprint.findByIdAndUpdate(req.params.id,
        {$set: newData}, function(err, sprint){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully updated");
                res.redirect("/sprints/" + sprint._id);
            }
        });
});

//DESTROY route
router.delete("/:id", checkSprintOwnership, function(req, res){
    Sprint.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/sprints");
        } else {
            res.redirect("/sprints");
        }
    });
});

function checkSprintOwnership(req, res, next){
    if(req.isAuthenticated()){
        Sprint.findById(req.params.id, function(err, sprint){
            if(sprint.author.id.equals(req.user._id)){
                return next();
            } else {
                res.send("No permissions to do that");
            }
        });
    }
}

module.exports = router;