const express=require("express"),
        app = express(),
        bodyParser = require("body-parser"), 
        mongoose = require("mongoose"), 
        passport = require("passport"),
        User = require("./models/user"), 
        LocalStrategy = require("passport-local"),
        methodOverride = require("method-override"),
        flash = require("connect-flash")

const storeRoutes = require("./routes/store"),
      homeRoutes = require("./routes/home"),
      indexRoutes = require("./routes/index"),
      loginRoutes = require("./routes/login")

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
// mongoose.connect("mongodb://localhost/techNugget", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://gautham:Jsbss1rhyruMElz8@technugget-x2kxs.mongodb.net/technugget?retryWrites=true&w=majority", {useNewUrlParser: true});

app.use(flash());
app.set("view engine", "ejs"); 
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Passport config
app.use(require("express-session")({
    secret: "My first webpage",
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.link = req.url.split('/')[1];
    res.locals.activeClass = "active";
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/store", storeRoutes);
app.use("/", homeRoutes);
app.use("/", indexRoutes);
app.use("/", loginRoutes);

app.listen(3000, ()=>{
	console.log("Server running on port 3000");
})
