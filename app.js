var express                 = require("express"),
    app                     = express(),
    request                 = require("request"),
    bodyParser              = require("body-parser"),
    cookieParser            = require("cookie-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    flash                   = require("connect-flash"),
    User                    = require("./models/user"),
    Sprint                  = require("./models/sprint"),
    Comment                 = require("./models/comment"),
    session                 = require("express-session"),
    port                    = process.env.PORT || 3777;
    url                     = process.env.DATABASEURL || "mongodb://localhost:27017/CobraKai";

//requiring routes
var indexRoutes = require("./routes/index"),
    sprintRoutes = require("./routes/sprints"),
    commentRoutes = require("./routes/comments");

// mongoose.connect("mongodb+srv://MonikaAdmin:monikaadmin@clustercobrakai-o6st9.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true});

mongoose.connect(url, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));

//passport config
app.use(require("express-session")({
    secret: "Sentence that will never be cracked hahaha",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();    
});

app.use("/", indexRoutes);
app.use("/sprints", sprintRoutes);
app.use("/sprints/:id/comments", commentRoutes);


app.get("*", function(req, res){
    res.send("Page not found!");
});

app.listen(port, process.env.IP, function(){
    console.log("Port 3777 is on.");
});