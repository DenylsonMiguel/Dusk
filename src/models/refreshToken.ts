import type { RefreshToken } from "../entities/refreshToken.js";
import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema<RefreshToken>({
    user_id: { type: String, ref: "User", required: true },
    token: { type: String, required: true },
    expires_at: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
});

export const RefreshTokenModel = mongoose.model<RefreshToken>(
    "RefreshToken",
    RefreshTokenSchema,
);
