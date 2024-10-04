const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utils/ExpressError.js");
const Review=require("../models/reviews.js")
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const Listing = require("../models/listings.js");
const {isLoggedIn, isAuthor,validateReview}=require("../middleware.js");

const reviewController= require("../controllers/reviews.js");
//post review into db
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete reviews
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview));
module.exports=router;