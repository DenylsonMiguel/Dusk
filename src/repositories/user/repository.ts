import { type UserDomain } from "./domain.js";
import { User, type UserResponseDTO } from "@/entities/user.js";
import db, { saveDB } from "@/database/db.js";
import { logger } from "@/helpers/logger.js";

export class UserRepository implements UserDomain {
    async create(user: User): Promise<UserResponseDTO> {
        if (!process.env.DB_PATH) {
            logger.error(
                "Database path is not defined in environment variables",
            );
            throw new Error(
                "Database path is not defined in environment variables",
            );
        }

        db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
            user.name,
            user.email,
            user.password,
        ]);

        const result = db.exec("SELECT last_insert_rowid() as id");
        const id = result[0]!.values[0]![0] as number;

        await saveDB(process.env.DB_PATH);

        return {
            id,
            name: user.name,
            email: user.email,
            password: user.password,
        };
    }

    async findAll(): Promise<UserResponseDTO[]> {}

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        // Implement the logic to find a user by email in the database
        throw new Error("Method not implemented.");
    }
}
