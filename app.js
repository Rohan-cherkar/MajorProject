const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const { title } = require("process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

let MONGO_URL = "mongodb://127.0.0.1:27017/Wonderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("i am root");
});

// index route
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// create new listing
app.get("/listings/new", (req, res) => {
  // res.render("new.ejs")
  // res.send("you are creating new ")
  // console.log("working")
  res.render("listings/new.ejs");
});

// create route
app.post("/listings", async (req, res) => {
  const {
    title: newTitle,
    description: newDescription,
    image: NewImage,
    price: newPrice,
    location: newLocation,
    country: newCountry,
  } = req.body;
  let newListing = new Listing({
    title: newTitle,
    description: newDescription,
    image: NewImage,
    price: newPrice,
    location: newLocation,
    country: newCountry,
  });

  await newListing.save().then((result) => {
    res.redirect("/listings"); //route to home page again
  });
});

// show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// redirect to the edit.ejs
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing)
  res.render("listings/edit.ejs", { listing });
});
// update the existing listing
app.put("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const {
    title: newTitle,
    description: newDescription,
    image: NewImage,
    price: newPrice,
    location: newLocation,
    country: newCountry,
  } = req.body;
  let newObj = {
    title: newTitle,
    description: newDescription,
    image: NewImage,
    price: newPrice,
    location: newLocation,
    country: newCountry,
  };
  await Listing.findByIdAndUpdate(id, newObj).then(() => {
    res.redirect(`/listings/${id}`);
    //  res.redirect(`/listings/`)
  });
});

app.delete("/listings/:id/delete", async (req, res) => {
  let { id } = req.params;
  // console.log(id)
  await Listing.findByIdAndDelete(id).then(() => {
    res.redirect("/listings");
  });
});

// app.get("/testListing", async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new home",
//         description:"By the beach",
//         price:4000,
//         location:"calingute,goa",
//         country:"india"
//     })

//     await sampleListing.save();
//     console.log("sample data is save")
//     res.send("successful")

// })

app.listen(port, () => {
  console.log("The Server is listerning");
});
