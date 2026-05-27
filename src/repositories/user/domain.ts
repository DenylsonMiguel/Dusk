import { User, type UserResponseDTO } from "../../entities/user.js";

export interface UserDomain {
    create(user: User): Promise<UserResponseDTO>;
    findAll(): Promise<UserResponseDTO[]>;
    findByEmail(email: string): Promise<UserResponseDTO | null>;
    incLoginAttempts(id: string): Promise<void>;
    resetLoginAttempts(id: string): Promise<void>;
    lockAccount(id: string, lockUntil: number): Promise<void>;
}
