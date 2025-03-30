const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => console.log("mongo connected")
).catch(err => console.log(err)
)

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


app.get("/", (req, res) => {
    res.send("working good...");
})

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
})

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})


app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/show", { listing });
})

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });

})

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});


app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    res.redirect("/listings");
})
// app.get("/listTesting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: 'By the beach',
//         price: 1200,
//         location: "calangute, goa",
//         country: "india",
//     })

//     await sampleListing.save();
//     console.log("testing done");
//     res.send("successfully complete...");
// })

app.listen(8000, () => {
    console.log("server connected at 8000");

})
