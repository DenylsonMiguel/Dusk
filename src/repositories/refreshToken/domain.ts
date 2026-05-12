import type { RefreshTokenResponseDTO } from "../../entities/refreshToken.js";

export interface RefreshTokenDomain {
    create(user_id: string): Promise<string>;
    findByToken(token: string): Promise<RefreshTokenResponseDTO | null>;
}
