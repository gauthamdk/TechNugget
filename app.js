const express=require("express"),
      app = express()

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.get("/", (req, res)=>{
	res.render("home");
})

app.listen(3000, ()=>{
	console.log("Server running on port 3000");
})
