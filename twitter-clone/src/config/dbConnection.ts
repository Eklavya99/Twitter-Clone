import mongoose from "mongoose";

export async function connectToDB(uri : string){
    if(!uri) throw new Error("Mongo URI missing");
    mongoose.connection.on("connected", () => {
        console.log("Connected to mongoDB instance.");
    })
    mongoose.connection.on("error", (err) => {
        console.error(err);
    })
    await mongoose.connect(uri);
}