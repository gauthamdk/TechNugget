const express = require("express"),
    router  = express.Router(),
    passport = require("passport")

router.get("/login", (req, res) =>{
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/store",
        failureRedirect: "/login"
    }),
(req, res)=>{}
);

router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});

module.exports = router;