const express=require("express"),
    app = express(),
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose")
    

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/techNugget", {useNewUrlParser: true})

let productSchema = new mongoose.Schema({
    name: String,
    image: String, 
    affiliateLink: String, 
    instagramLink: String
});

let Product = mongoose.model("Product", productSchema);

// Product.create({
//     name: "iphone",
//     image: "nice picture string", 
//     affiliateLink: "amazon here i come", 
//     instagramLink: "go visit my page"
// })

app.get("/", (req, res)=>{
	res.redirect("/home");
})

app.get("/home", (req, res)=>{
    res.render("home", {link :req.url.split('/')[1], activeClass: "active"});
})

app.get("/store", (req, res)=>{

    let products = Product.find({}, (err, products)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("store", {link :req.url.split('/')[1], activeClass: "active", products: products })
        }
    })
})

app.listen(3000, ()=>{
	console.log("Server running on port 3000");
})
