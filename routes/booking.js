// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/booking");
// const Listing = require("../models/listing");
// const { isLoggedIn } = require("../middleware.js");



// // POST route to create a booking
// router.post("/:listingId/book", isLoggedIn, async  (req, res) => {
//   try {
//     const { listingId } = req.params;
//     const { checkIn, checkOut } = req.body;

//     const listing = await Listing.findById(listingId);
//     if (!listing) return res.status(404).send("Listing not found");

//     const days =
//       (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
//     const totalPrice = days * listing.price; // assuming listing has a price field

//     const booking = new Booking({
//       listing: listingId,
//       checkIn,
//       checkOut,
//       totalPrice,
//     });

//     await booking.save();
   
//     res.render("listings/success", { listing, success });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Booking failed");
//   }
// });
   



// module.exports = router;


const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");

// ✅ GET route to show booking form
router.get("/:listingId/book", isLoggedIn, async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/book", { listing });
});

// ✅ POST route to create a booking
router.post("/:listingId/book", isLoggedIn, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    const days =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    const totalPrice = days * listing.price;

    const booking = new Booking({
      listing: listingId,
      checkIn,
      checkOut,
      totalPrice,
      user: req.user._id, // optional: track who booked
    });

    await booking.save();

    req.flash("success", "Booking successful!");
    res.render("listings/success", { listing, booking });
  } catch (err) {
    console.error(err);
    req.flash("error", "Booking failed!");
    res.redirect("/listings");
  }
});

module.exports = router;
