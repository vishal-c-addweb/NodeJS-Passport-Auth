import User from "../models/user";
import passport from "passport";
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
},
    async function (accessToken: any, refreshToken: any, profile: any, done: any) {
        if (!await User.findOne({ email: profile.emails[0].value })) {
            let user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: null
            });
            await user.save();
            return done(null, profile);
        }
        return done(null, profile);
    }
));