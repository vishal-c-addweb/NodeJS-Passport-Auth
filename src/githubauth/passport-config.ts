import User from "../models/user";
import passport from "passport";
const GitHubStrategy = require('passport-github').Strategy;
require('dotenv').config();

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:8000/auth/github/callback"
},
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
        return done(null, profile);
    }
));