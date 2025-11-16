const express = require("express");
const router = express.Router({mergeParams: true }); // to access id from app.js
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expresserror.js");
//  const {listingSchema} = require("../schema.js");// use listingschema 
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const review = require("../models/review.js");
const reviewcontrollers = require("../controllers/reviews.js");
      
      //  post review  route
 router.post("/", isLoggedIn , validateReview, wrapAsync(reviewcontrollers.createReview));

          // delete review route
    router.delete("/:reviewId", isLoggedIn, isReviewAuthor,  wrapAsync(reviewcontrollers.deleteReview));
    module.exports = router;