if (process.env.NODE_ENV != "production") {
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate  = require("ejs-mate");  // require boilerplate
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expresserror.js");
const {listingSchema, reviewSchema} = require("./schema.js");  // use listingschema
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const bookingRoutes = require("./routes/booking.js");


const listingsroutes = require("./routes/listing.js");
const reviewrouter = require("./routes/reviws.js");
const userrouter = require("./routes/user.js");



const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use (express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);   // create boilerplate templete
app.use(express.static(path.join(__dirname,"/public" )));  //use for static file (css styling)

const store = MongoStore.create({
     mongoUrl: dbUrl,
     crypto: {
      secret: process.env.SECRET,
     },
     touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("error in mongosession store", err);
});


    const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


// app.get("/", (req, res)=> {
//     res.send("hi i am root");
// });
        // mongostore


app.use(session(sessionOptions));
 app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next )=>{
res.locals.success = req.flash("success"); 
res.locals.error = req.flash("error"); 
res.locals.currentUser = req.user;

next();
});

// app.get("/demouser", async (req, res)=>{
//     let fakeuser = new User({
//         username: "delta=students",
//         email: "student@gmial.com",
//     });
//     let registeredUser = await User.register(fakeuser, "helloworld")
//     res.send(registeredUser);
// })
   
     // use listings routes from the routes folder
app.use("/bookings", bookingRoutes);
app.use("/listings", listingsroutes);
app.use("/listings/:id/reviews", reviewrouter);

app.use("/", userrouter); 
  
  app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404,"Page not found"));

});


app.use((err, req, res, next)=>{
    let {status = 500, message = "something went wrong"} = err;
   res.status(status).render("error.ejs", {message});
    // res.status(status).send(message);
});
// app.use((err, req, res, next)=>{
//     res.send("something went wrong");
// })
app.listen(8080, ()=> {
    console.log("server is listening to port  8080");
})










