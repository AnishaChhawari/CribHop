const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn , isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router.get("/search", wrapAsync(listingController.searchListings));
router.route("/")

// LIST all listings
    .get(wrapAsync(listingController.index))
    // CREATE new listing
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createNewListing));
    


// NEW listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    // SHOW specific listing
    .get(wrapAsync(listingController.showListing))
    //Update
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
// DELETE listing
    .delete( isLoggedIn,wrapAsync(listingController.destroyListing));



// EDIT listing form
router.get("/:id/edit", isLoggedIn,wrapAsync(listingController.renderEditForm));








module.exports = router;
