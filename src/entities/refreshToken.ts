export class RefreshToken {
    constructor(
        public user_id: string,
        public token: string,
        public expires_at: Date,
        public created_at: Date,
    ) {}
}

export type RefreshTokenResponseDTO = {
    id: string;
    user_id: string;
    token: string;
    expires_at: Date;
    created_at: Date;
};
