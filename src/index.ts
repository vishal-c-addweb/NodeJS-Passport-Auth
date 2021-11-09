import express, { Request, Response, NextFunction } from "express";
import connectDB from "../config/dbconnection";
import bcrypt from "bcrypt";
import passport from "passport";
import User, { IUser } from "./models/user";
const initialize = require("./passport-config");
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieSession = require('cookie-session');
const app = express();
const path = require('path');
require('dotenv').config();
require('./googleauth/passport-config');
require('./githubauth/passport-config');

initialize(passport);

connectDB();

app.set('view-engine', 'ejs');
app.set('view-engine', 'pug');
app.use(cookieSession({
    name: 'session',
    keys: ['key1'],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(methodOverride('_method'));
const isloggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', isloggedIn, checkAuthenticated, (req, res) => {
    res.render('index.ejs');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashed: string = await bcrypt.hash(req.body.password, 10);
        let user: IUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashed
        });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        res.redirect('/register');
    }
});

app.get('/profile', isloggedIn, checkAuthenticated, (req, res) => {
    res.render('profile.ejs', { user: req.user });
});

app.post('/update', isloggedIn, checkAuthenticated, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user,
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email
                }
            });
        let user = await User.findOne({"name":req.body.name}); 
        res.render('profile.ejs', { user: user });
    } catch (error) {
        console.log(error);
        res.redirect('/profile');
    }
});

app.get('/my', (req, res) => {
    res.render('my.pug');
});

app.delete('/logout', (req, res) => {
    req.session = null;
    res.cookie('connect.sid', '', { expires: new Date(1), path: '/' });
    req.logOut();
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/login');
});

//google auth
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

//github auth
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        res.redirect('back');
    } else {
        next();
    }
}

app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
    //lsof -i ${3000} -t | xargs kill
});