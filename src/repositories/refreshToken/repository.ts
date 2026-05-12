import { type RefreshTokenResponseDTO } from "../../entities/refreshToken.js";
import { logger } from "../../helpers/logger.js";
import { RefreshTokenModel } from "../../models/refreshToken.js";
import type { RefreshTokenDomain } from "./domain.js";

export class RefreshTokenRepository implements RefreshTokenDomain {
    async create(user_id: string): Promise<string> {
        try {
            const token = crypto.randomUUID();
            const expires_at = new Date();
            expires_at.setDate(expires_at.getDate() + 7);

            await RefreshTokenModel.create({
                user_id,
                token,
                expires_at,
                created_at: new Date(),
            });

            return token;
        } catch (err) {
            logger.error(`Error creating refresh token: ${err}`);
            throw new Error("Error creating refresh token", {
                cause: err,
            });
        }
    }

    async findByToken(token: string): Promise<RefreshTokenResponseDTO | null> {
        try {
            const tok = await RefreshTokenModel.findOne({ token });
            if (!tok) return null;
            return {
                id: tok._id as unknown as string,
                user_id: tok.user_id,
                token: tok.token,
                expires_at: tok.expires_at,
                created_at: tok.created_at,
            };
        } catch (err) {
            logger.error(`Error on get refresh token by email: ${err}`);
            throw new Error("Error on get refresh token by email", {
                cause: err,
            });
        }
    }
}
