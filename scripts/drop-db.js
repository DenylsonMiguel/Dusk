import mongoose from "mongoose";
import "dotenv/config";

async function drop() {
    if (!process.env.DB_URI) throw new Error("environment variable DB_URI is undefined")
    
    await mongoose.connect(process.env.DB_URI);
    
    await mongoose.connection.dropDatabase();
    
    console.log("Database dropped");
    
    await mongoose.disconnect();
}

drop();
