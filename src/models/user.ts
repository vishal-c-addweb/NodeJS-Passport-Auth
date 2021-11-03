import { Document, Schema } from "mongoose";
import mongoose from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param name:string
 * @param email:email
 * @param password:string
 * @param timestamps:string
 */

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
