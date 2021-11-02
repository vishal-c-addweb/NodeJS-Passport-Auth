import express, { Request, Response, NextFunction } from "express";
import connectDB from "../config/dbconnection";
import bcrypt from "bcrypt";
import passport from "passport";
import User, { IUser } from "./models/user";
const initialize = require("./passport-config");
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
require('dotenv').config();
const users: any = [];

initialize(passport);

connectDB();

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: "vishal" });
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

app.delete('/logout',(req,res) => {
    req.logOut();
    res.redirect('/login');
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function checkNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
}

app.listen(3000, () => {
    console.log("server started on port 3000");
})