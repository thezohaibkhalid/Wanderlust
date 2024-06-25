const express = require("express");
const path = require('path');
const app = express();
const methodOverride = require("method-override");

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';





main().then(() => {
    console.log("Connected to database");
}).catch((err => {
    console.log(err);
}));

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.get("/", (req, res) => {
    res.send("Hi I am the Root");
});


// app.get("/testlisting", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My House",
//         description: "2 Kanals house",
//         price: 2.5,
//         location: "Karachi",
//         country: "Pakistan",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successfull test")
// });


app.get("/listings", async (req, res) => {
    console.log("Working");
    // res.send("Listings is working");
    const allListings = await Listing.find({})
    // console.log(allListings);
    res.render("index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("new.ejs")
});

//Show route
app.get("/listings/:id", async (req, res) => {

    const { id } = req.params;


    const toShow = await Listing.findById(id);

    res.render("show.ejs", { toShow });
});




app.post("/listings", async (req, res) => {
    const { title, description, price, location, country, image } = req.body;

    let newListing = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        image: { filename: image }
    });

    console.log(newListing);

    await newListing.save()
        .then(() => {
            console.log("Your listing was saved");
            res.redirect("/listings");
        })
        .catch((err) => {
            console.log("Error saving listing:", err);
            res.status(500).send("Error saving listing");
        });
});


//Edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing })
});

//Edit update route

app.put("/listings/:id", async (req, res) => {
    const id = req.params.id;
    const { title, description, price, location, country, } = req.body;

    const updateListing = {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
    };

    await Listing.findByIdAndUpdate(
        id,
        updateListing,
        { new: true, runValidators: true }
    );
    res.redirect("/listings")
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

