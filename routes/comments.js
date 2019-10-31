var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Sprint      = require("../models/sprint"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//COMMENTS ROUTES

router.get("/new", middleware.isLoggedIn, function(req, res){
    //find sprint by id
    Sprint.findById(req.params.id, function(err, sprint){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {sprint: sprint});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Sprint.findById(req.params.id, function(err, sprint){
        if(err){
            console.log(err)
            res.redirect("/sprints");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    sprint.comments.push(comment);
                    sprint.save();
                    req.flash('success', 'Comment created!');
                    res.redirect("/sprints/" + sprint._id);
                }
            });
        }
    });
});

//EDIT comment route

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err)
        } else {
            // res.render("comments/edit", {sprint: req.params.name, sprint_id: req.params.id, comment: comment}); //Cannot read property '_id' of undefined
            // res.render("comments/edit", {sprint_id: req.params.id, comment: comment}); //sprint is not defined
            res.render("comments/edit", {sprint: req.params.id, comment: comment}); //render edit but: Cannot PUT /sprints//comments/5db06dd7662db2240819ec3a
            // res.render("comments/edit", {sprint: sprint, comment: comment}); //nie udalo sie polaczyc: http://localhost:3777/sprints/5da95db7d071a850444368fd/comments/5db06dd7662db2240819ec3a/edit
        }
    });
});

//UPDATE comment route

router.put("/:commentId/", function(req, res){
// router.put("/:commentId/", middleware.checkUserComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err){
            res.render("edit");
        } else {
            res.redirect("/sprints/" + req.params.id);
        }
    });
});

//DELETE route

router.delete("/:commentId", middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("Ooops, problem!");
        } else {
            res.redirect("/sprints/" + req.params.id);
        }
    });
});


module.exports = router;