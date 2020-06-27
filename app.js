const express=require("express"),
    app = express(),
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"), 
    passport = require("passport"),
    User = require("./models/user"), 
    Product = require("./models/product"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")

const storeRoutes = require("./routes/store")

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/techNugget", {useNewUrlParser: true})

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
// User.register({
//     username: "gauthamdk"},
//     "whatever1234", (err)=>{
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("Success");
//         }
//     }
// )

app.use((req, res, next) =>{
    res.locals.link = req.url.split('/')[1];
    res.locals.activeClass = "active";
    next();
})

app.use("/store", storeRoutes);

app.get("/", (req, res)=>{
	res.redirect("/home");
})

app.get("/home", (req, res)=>{
    res.render("home");
})

app.get("/login", (req, res) =>{
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/store",
        failureRedirect: "/login"
    }),
(req, res)=>{}
);

app.listen(3000, ()=>{
	console.log("Server running on port 3000");
})
