const express = require("express");
const router = express.Router(); // to access id from app.js
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usercontrollers  = require("../controllers/users.js");
const user = require("../models/user.js");

router.get("/signup", usercontrollers.rendersignupform);
   // signup routes
router.post("/signup", wrapAsync (usercontrollers.signup));

router.get("/login", usercontrollers.renderloginform );
     // login routes
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local", 
     {failureRedirect: '/login',
     failureFlash: true
    }),
      usercontrollers.login);

   // logout routes
router.get("/logout", usercontrollers.logout );

module.exports = router;