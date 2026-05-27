export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public loginAttempts?: number,
        public lockUntil?: number | undefined,
    ) {}
}

export type UserResponseDTO = {
    _id: string;
    name: string;
    email: string;
    password: string;
    loginAttempts: number;
    lockUntil?: number | undefined;
};

export type PublicUser = {
    id: string;
    name: string;
    email: string;
};
