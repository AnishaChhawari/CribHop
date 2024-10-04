const Listing = require('./models/listings'); // Adjust the path as needed
const Review=require('./models/reviews');
const {reviewSchema,listingSchema}=require("./schema");
const ExpressError=require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    
        let listing = await Listing.findById(id); // Correct usage with await
        
        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have the permissions.");
            return res.redirect(`/listings/${id}`);
        }
        next();
     
    
};

module.exports.isAuthor = async (req, res, next) => {
    let { id , reviewId } = req.params;
    
        let review = await Review.findById(reviewId); // Correct usage with await
        
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have the permissions.");
            return res.redirect(`/listings/${id}`);
        }
        next();
     
    
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

