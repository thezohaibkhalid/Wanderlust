const mongoose = require("mongoose");
const Listing = require("../models/listing");
const sampleListings = require('./data.js');


const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

main().then(() => {
    console.log("Connected to database");
}).catch((err => {
    console.log(err);
}));

async function main() {
    await mongoose.connect(MONGO_URL);
}


const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("data initialize");
}

initDB();