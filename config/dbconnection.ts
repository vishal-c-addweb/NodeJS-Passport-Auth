import { ConnectionOptions, connect } from "mongoose";
require("dotenv").config();

const connectDB = async () => {
    try {
        const mongoURI: string = process.env.MONGO_URI;
        const options: ConnectionOptions = {
            dbName: 'passport_auth',
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
        await connect(mongoURI, options);
        console.log("mongodb connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectDB;