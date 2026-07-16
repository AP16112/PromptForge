
//This express is actually a function here
const express = require("express");

// Now we will create our router object here
// so we will use this :- const router = express.Router();
const router = express.Router();  //Creates a new router instance.
// This router is like a mini Express app that can handle its own routes and middleware.
// It has access to all HTTP methods (get, post, put, delete, etc.), just like app does.
// So instead of writing everything in app.js with app.get() or app.post(), you define routes here with router.get() or router.post().

const User = require("../models/user.js");

const passport = require("passport");



// Here this 'signup' route is used to register a new user, so here we will write the logic to register a new user in this 'signup' route here
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }


    try {
        const existing = await User.findOne({ email });
        
        if(existing) {
            return res.status(409).json({ error: "Email already in use." });
        }

        await User.register(new User({ name, email }), password);

        // User registered successfully
        res.json({
            success: true,
            message: 'Signup successful. Please login!'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not create account." });
    }
});




// Here this is 'login' route used to authenticate the user
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: "Email not registered. Please sign up first." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Unable to validate credentials." });
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: info?.message || "Invalid credentials." });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
        });
    })(req, res, next);
});




router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ success: true });
    });
});




router.get("/status", (req, res) => {
    if(req.isAuthenticated()) {
        return res.json({ authenticated: true, user: { id: req.user._id, name: req.user.name, email: req.user.email } });
    }
    res.json({ authenticated: false });
});


module.exports = router;
