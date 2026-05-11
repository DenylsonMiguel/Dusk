import { logger } from "../helpers/logger.js";
import mongoose from "mongoose";

export async function initDb() {
    try {
        if (!process.env.DB_URI)
            throw new Error("DB_URI environment variable is not set");
        await mongoose.connect(process.env.DB_URI);
        logger.info("Database initialized successfully");
    } catch (err) {
        logger.error(`Error initializing database: ${err}`);
        throw new Error("Error initializing database", { cause: err });
    }
}
