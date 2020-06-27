const express=require("express"),
    app = express(),
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"), 
    passport = require("passport"),
    User = require("./models/user"), 
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")

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


mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/techNugget", {useNewUrlParser: true})

let productSchema = new mongoose.Schema({
    name: String,
    image: String, 
    affiliateLink: String, 
    instagramLink: String, 
    created: {type: Date, default: Date.now}
});

let Product = mongoose.model("Product", productSchema);

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

app.get("/", (req, res)=>{
	res.redirect("/home");
})

app.get("/home", (req, res)=>{
    res.render("home");
})

app.get("/store", (req, res)=>{

    let products = Product.find({}, (err, products)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("store", {products: products})
        }
    }).sort({ created: 'desc' });
})

app.get("/store/create", isLoggedIn, (req, res)=>{
    res.render("addProduct");
})

app.post("/store/create", isLoggedIn, (req, res)=>{
    const product = req.body.product;

    Product.create(product, (err, newProduct)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/store");
        }
    });
})

app.get("/store/:id/edit", isLoggedIn, (req, res)=>{
    Product.findById(req.params.id, (err, foundProduct)=>{
        res.render("editProduct", {product: foundProduct});
    })
});

app.put("/store/:id", isLoggedIn, (req, res)=>{
    Product.findByIdAndUpdate(req.params.id, req.body.product, (err, updatedProduct)=>{
        if(err){
            res.redirect("/store/" + req.params.id + "/edit");
        }
        else{
            res.redirect("/store");
        }
    })
});

app.delete("/store/:id", isLoggedIn, (req, res)=>{
    Product.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/store");
        }
        else{
            res.redirect("/store");
        }
    })
})

app.get("/login", (req, res) =>{
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/store/create",
        failureRedirect: "/login"
    }),
(req, res)=>{}
);

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

app.listen(3000, ()=>{
	console.log("Server running on port 3000");
})
