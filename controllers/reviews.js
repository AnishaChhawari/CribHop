const Listing = require("../models/listings");
const Review= require("../models/reviews");
const wrapAsync=require("../utils/wrapAsync.js");

module.exports.createReview=async(req,res)=>{
    let {id}= req.params;
    let listing =await Listing.findById(id);
    const newReview=new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.author);
    
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("saved review");
    req.flash("success","New review created.")
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully.");
    res.redirect(`/listings/${id}`);
};
