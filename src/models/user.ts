import type { User } from "../entities/user.js";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number },
});

export const UserModel = mongoose.model<User>("User", UserSchema);
