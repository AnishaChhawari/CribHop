const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listings.js");

const MONGO_URL= 'mongodb://127.0.0.1:27017/wanderlust';
async function main(){
    await mongoose.connect(MONGO_URL);
}
main()
    .then(()=>{
        console.log("connection created with intialised data");

    })
    .catch((err)=>{
        console.log(err);
    });

const initDB= async ()=>{
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"66ef9b85430d4a105268f47f"}));
    await Listings.insertMany(initData.data);
    console.log("data is initialised");
}
initDB();