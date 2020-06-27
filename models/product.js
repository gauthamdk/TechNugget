const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
    name: String,
    image: String, 
    affiliateLink: String, 
    instagramLink: String, 
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Product", productSchema);
