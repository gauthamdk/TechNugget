const express = require("express"),
      router = express.Router(),
      Product = require("../models/product"),
      middleware = require("../middleware")

router.get("/", (req, res)=>{

    Product.find({}, (err, products)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("store", {products: products})
        }
    }).sort({ created: 'desc' });
})

router.get("/create", middleware.isLoggedIn, (req, res)=>{
    res.render("addProduct");
})

router.post("/create", middleware.isLoggedIn, (req, res)=>{
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

router.get("/:id/edit", middleware.isLoggedIn, (req, res)=>{
    Product.findById(req.params.id, (err, foundProduct)=>{
        res.render("editProduct", {product: foundProduct});
    })
});

router.put("/:id", middleware.isLoggedIn, (req, res)=>{
    Product.findByIdAndUpdate(req.params.id, req.body.product, (err, updatedProduct)=>{
        if(err){
            res.redirect("/store/" + req.params.id + "/edit");
        }
        else{
            res.redirect("/store");
        }
    })
});

router.delete("/:id", middleware.isLoggedIn, (req, res)=>{
    Product.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/store");
        }
        else{
            res.redirect("/store");
        }
    })
})

module.exports = router;