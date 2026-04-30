import "dotenv/config";
import initSqlJs, { type Database } from "sql.js";
import fs from "fs";
import { logger } from "../helpers/logger.js";

const SQL = await initSqlJs();

const filePath = process.env.DB_FILE;
if (!filePath) {
    logger.error("Missing DB_FILE");
    throw new Error("Environment variable DB_FILE is undefined");
}

let db: Database;
if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    db = new SQL.Database(fileBuffer);
} else {
    db = new SQL.Database();
}

export function saveDB(path: string) {
    const data = db.export();
    fs.writeFileSync(path, Buffer.from(data));
}

db.run(
    "CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password TEXT NOT NULL, sleep_goal INTEGER NOT NULL CHECK (sleep_goal BETWEEN 0 AND 1439) )",
);
db.run(
    "CREATE TABLE IF NOT EXISTS sleep_logs ( id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, sleep_date TEXT NOT NULL, slept_at INTEGER NOT NULL CHECK (slept_at BETWEEN 0 AND 1439), on_target INTEGER NOT NULL CHECK (on_target IN (0, 1)), FOREIGN KEY (user_id) REFERENCES users(id) )",
);

saveDB(filePath);

logger.log("DB started");

export default db;
