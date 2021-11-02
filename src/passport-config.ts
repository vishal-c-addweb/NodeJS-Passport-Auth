const LocalStrategy = require('passport-local').Strategy;
import bcrypt from "bcrypt";
import { Request } from "express";
import User from "./models/user";

async function initialize(passport: any) {
    const authenticateUser = async (email: string, password: string, done: any, req: Request) => {
        let user: any = await User.findOne({email:email});
        if (user === null || user === undefined) {
            return done(null, false, { message: "No user with that email" })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password incorrect" });
            }
        } catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
    passport.serializeUser((user: any, done: any) => done(null, user.id));
    passport.deserializeUser(async (id: any, done: any) => {
        return done(null,await User.findOne({_id:id}));
    });
}
module.exports = initialize;