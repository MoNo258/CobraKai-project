var Comment = require("../models/comment");
var Sprint = require("../models/sprint");

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkUserSprint: function(req, res, next){
        if(req.isAuthenticated()){
            Sprint.findById(req.params.id, function(err, sprint){
                if(sprint.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    console.log("Bad");
                    res.redirect("/sprints/" + req.params.id);
                }
            });
        } else {
            req.flash("error","You need to be signed in to do that");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("you MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("/sprint/" + req.params.id);
                }
            });
        } else {
            req.flash("error", "you need to be signed in to do that");
            res.redirect("login");
        }
    }
}