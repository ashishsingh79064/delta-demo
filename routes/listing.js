const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner ,validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js"); 
const multer  = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });



//  Search route 

router.get("/search", wrapAsync(async (req, res) => {
  const query = req.query.q?.trim();
  if (!query) {
    req.flash("error", "Please enter a search term!");
    return res.redirect("/listings");
  }

  const regex = new RegExp(query, "i"); // case-insensitive regex
  const listings = await Listing.find({
    $or: [
      { title: regex },
      { location: regex },
      { description: regex }
    ]
  });


  res.render("listings/index", { listings });

}));



router.route("/")
.get(wrapAsync( listingsController.index))    // index route
.post(                                       // create route
  isLoggedIn, 
  upload.single("listing[image]"),
    validateListing,
  wrapAsync (listingsController.createListing) 
);


  
// New  route
router.get("/new", isLoggedIn, listingsController.renderNewForm );


  router.route("/:id")
  .get( wrapAsync (listingsController.showListing)    // show route
 )   
  .put( isLoggedIn, isOwner, 
   upload.single("listing[image]"), validateListing,        // update route 
  wrapAsync (listingsController.updateListing)
)
  .delete( isLoggedIn, isOwner,              // delete route
wrapAsync (listingsController.deleteListing) );

// edit  route
router.get("/:id/edit", isLoggedIn,isOwner, 
wrapAsync (listingsController.renderEditForm) ); 




//   // index route
// router.get("/", wrapAsync( listingsController.index) );


//  // show route
// router.get("/:id", wrapAsync (listingsController.showListing) );

//  // create route
// router.post("/",
//   isLoggedIn, 
//   validateListing, 
//   wrapAsync (listingsController.createListing) );

 

//  // update route
// router.put("/:id", isLoggedIn, isOwner, validateListing,  
//   wrapAsync (listingsController.updateListing));

//   // delete route
// router.delete("/:id", isLoggedIn, isOwner, 
// wrapAsync (listingsController.deleteListing) );


  module.exports = router;
