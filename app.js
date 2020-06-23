const express=require("express"),
    app = express(),
    bodyParser = require("body-parser")
    

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
    req.active = req.path.split('/')[1] // [0] will be empty since routes start with '/'
    next();
});

app.get("/", (req, res)=>{
	res.redirect("/home");
})

app.get("/home", (req, res)=>{
    res.render("home", {link :req.url.split('/')[1], activeClass: "active"});
})

app.get("/store", (req, res)=>{
    res.render("store", {link :req.url.split('/')[1], activeClass: "active"})
})

app.listen(3000, ()=>{
	console.log("Server running on port 3000");
})
