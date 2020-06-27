const express = require("express"),
      router = express.Router(),
      Product = require("../models/product"),
      middleware = require("../middleware")

router.get("/", (req, res)=>{

    Product.find({}, (err, products)=>{
        if(err){
            req.flash("error", "Error displaying products");
            res.redirect("/home");
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
            req.flash("error", "Failed to create product");
            res.redirect("/");
        }
        else{
            req.flash("success", "Succesfully added product");
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
            req.flash("error", "Error editing product");
            res.redirect("/" + req.params.id + "/edit");
        }
        else{
            req.flash("success", "Successfully edited product!");
            res.redirect("/store");
        }
    })
});

router.delete("/:id", middleware.isLoggedIn, (req, res)=>{
    Product.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Error deleting product");
            res.redirect("/store");
        }
        else{
            req.flash("error", "Successfully deleted product");
            res.redirect("/store");
        }
    })
})

module.exports = router;