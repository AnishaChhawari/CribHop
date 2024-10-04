const Listing = require("../models/listings");


const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const showListing = await Listing.findById(id)
        .populate({
            path: 'review', // Ensure this matches your Listing schema
            populate: { path: 'author' } // Populate the author field
        })
        .populate('owner');
    console.log(showListing.owner);
    if (!showListing) {
        req.flash("error", "The Listing you are accessing doesn't exist.");
        return res.redirect("/listings");
    }

    console.log(showListing); // Log to verify the structure of showListing
    res.render("listings/show.ejs", { showListing });
};


module.exports.createNewListing=async (req, res) => {
    let response= await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        
      .send();
      
      
        

    let url= req.file.path;
    let filename=req.file.filename;
    console.log(url,filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    let savedListing=newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!!!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const editListing = await Listing.findById(id);
    let orgUrl= editListing.image.url;
    orgUrl=orgUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { editListing ,orgUrl});
};

module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid listing data for update");
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Edited!!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!!");
    res.redirect("/listings");
};


module.exports.searchListings = async (req, res) => {
    const query = req.query.q; // Get the search query
    const matchingListings = await Listing.find({
        location: { $regex: query, $options: 'i' } // Case insensitive search
    });

    if (matchingListings.length === 0) {
        req.flash("error", "No locations found.");
        return res.redirect("/listings"); // Redirect or you can render an error page
    }

    res.render("listings/index.ejs", { allListings: matchingListings });
};
