import { type UserDomain } from "./domain.js";
import { User, type UserResponseDTO } from "../../entities/user.js";
import { logger } from "../../helpers/logger.js";
import { UserModel } from "../../models/user.js";

export class UserRepository implements UserDomain {
    async create(user: User): Promise<UserResponseDTO> {
        try {
            const createdUser = await UserModel.create(user);
            return {
                _id: createdUser._id.toString(),
                name: createdUser.name,
                email: createdUser.email,
                password: createdUser.password,
                loginAttempts: createdUser.loginAttempts ?? 0,
                lockUntil: createdUser.lockUntil,
            };
        } catch (err) {
            logger.error(`Error creating user: ${err}`);
            throw new Error("Error creating user", { cause: err });
        }
    }

    async findAll(): Promise<UserResponseDTO[]> {
        try {
            const users = await UserModel.find();
            return users.map((user) => ({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                password: user.password,
                loginAttempts: user.loginAttempts ?? 0,
                lockUntil: user.lockUntil,
            }));
        } catch (err) {
            logger.error(`Error finding users: ${err}`);
            throw new Error("Error finding users", { cause: err });
        }
    }

    async findByEmail(email: string): Promise<UserResponseDTO | null> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) return null;
            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                password: user.password,
                loginAttempts: user.loginAttempts ?? 0,
                lockUntil: user.lockUntil,
            };
        } catch (err) {
            logger.error(`Error finding user by email: ${err}`);
            throw new Error("Error finding user by email", { cause: err });
        }
    }

    async incLoginAttempts(id: string): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(id, { $inc: { loginAttempts: 1 } });
        } catch (err) {
            logger.error(`Error incrementing login attempts: ${err}`);
        }
    }

    async resetLoginAttempts(id: string): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(id, {
                $set: { loginAttempts: 0 },
                $unset: { lockUntil: 1 },
            });
        } catch (err) {
            logger.error(`Error resetting login attempts: ${err}`);
        }
    }

    async lockAccount(id: string, lockUntil: number): Promise<void> {
        try {
            await UserModel.findByIdAndUpdate(id, { $set: { lockUntil } });
        } catch (err) {
            logger.error(`Error locking account: ${err}`);
        }
    }
}
