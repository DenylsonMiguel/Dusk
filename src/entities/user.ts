export class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
    ) {}
}

export type UserResponseDTO = {
    _id: string;
    name: string;
    email: string;
    password: string;
};

export type PublicUser = {
    id: string;
    name: string;
    email: string;
};
