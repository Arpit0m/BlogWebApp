//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let posts = [];


mongoose.connect("mongodb://localhost:27017/blogDB",{family : 4}).then((value)=>{
   console.log(value)
   console.log("Connected to db succesfully");
}).catch((err)=>{
  console.log(err);
})

const postSchema =  new mongoose.Schema({
  post_title :String,
  post_text : String

});
const Post = new mongoose.model("Post",postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// routing to home page  
// passing default content using json {key(front end):value(back end)}
app.get("/",function(req,res){

  Post.find().then((posts)=>{
    //console.log("posts found")
   // console.log(posts)
    res.render("home",{homeStartingContent : homeStartingContent, posts : posts});
    
  }).catch((err)=>{
    console.log(err);
  })
  
});



//routing request to post page
app.get("/posts/:post_id",function(req,res){

  let postid_requested = req.params.post_id;
  //console.log(postid_requested);

    Post.findById(postid_requested).then((post)=>{
          res.render("post",{post:post});
      }).catch((err)=>{
           console.log(err);
      })
      
});



//routing to compose page
app.get("/compose",function(req,res){
  res.render("compose");
});



// routing post request to compose page
// storing user data in post variable
// appending data in global posts array
app.post("/compose",function(req,res){
  //***** comsole log on server side
    //console.log(req.body.post_title);
    //console.log(req.body.post_text);
    // const post = {
    //   post_title : req.body.post_title,
    //   post_text : req.body.post_text
    // };

    // posts.push(post);

    const post = new Post({
      post_title : req.body.post_title,
      post_text : req.body.post_text
    });

    post.save();


     

    res.redirect("/");
});




// routing to home page 
app.get("/home",function(req,res){
  res.render("home",{homeStartingContent : homeStartingContent});
});


// routing request to about-us page
app.get("/about-us",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});



// routing request to contact-us page
app.get("/contact-us",function(req,res){
  res.render("contact",{contactContent:contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
