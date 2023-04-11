//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
// import blogs from "./blogs";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true})); // urlencoded allows to access form data
app.use(express.static("public"));

// Using mongodb atlas cloud database
mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@cluster0.ibq9jtu.mongodb.net/"+process.env.DB)
.then(()=> console.log("Connected to MongoDB Database"))
.catch((err)=> console.log(err));

var usergreeting="";
var bookdata;
var cartitems = [];

const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  username: String,
  password: String,
});
const User = new mongoose.model("User", userSchema);

const bookSchema ={
  name: String,
  author: String,
  img:String,
  year: Number,
  price: Number,
  // src: String,
  // content: String,
};

const Book = mongoose.model("Book", bookSchema);
const getBooks = async ()=>{
  try{
    bookdata = await Book.find();
  }catch(err){
    console.log(err);
  }
};
getBooks();

app.get("/" ,function(req, res){
  res.render("home",{bookdata:bookdata,cartitems:cartitems});
});
  
app.get("/cart" ,function(req, res){
  res.render("cart",{bookdata:bookdata,cartitems:cartitems});
});
app.get("/cart/:itemid" ,function(req, res){
  const reqitem = (req.params.itemid);
  cartitems.push(reqitem);
  res.redirect("/cart");
});

app.post("/", function(req,res){
  res.redirect("/cart");
});

app.post("/login", function(req,res){
  const userid = req.body.userid;
  /*Level 3 Encryption*/
  const password = md5(req.body.password);
  const findUser = async ()=>{
        try{
            const foundUser = await User.findOne({$or:[{email:userid},{username:userid}]});
            if(foundUser == null){

            }
            else if(foundUser.password == password){
              // usergreeting = "Hi! "+foundUser.fname;
              res.redirect("/");
            }else{
              // An alert that says incorrect password
             res.send('<h1>Incorrect password</h1>');
            }
      }catch(err){
          console.log(err);
        }
    };
    findUser();
  });


app.listen(3000, function(){
    console.log("Server started at Port 3000");
});
