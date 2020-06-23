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
//     name: "iPad Pro",
//     image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-11-select-wifi-spacegray-202003_GEO_AE_FMT_WHH?wid=940&hei=1112&fmt=png-alpha&qlt=80&.v=1583546266416",
//     affiliateLink: "https://amzn.to/2NovJtU", 
//     instagramLink: "https://www.instagram.com/p/B_0SmZJFvZ-/"
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
