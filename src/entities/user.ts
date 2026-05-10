export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
    ) {}
}

export type UserResponseDTO = {
    id: number;
    name: string;
    email: string;
    password: string;
};

export type PublicUser = Omit<UserResponseDTO, "password">;
