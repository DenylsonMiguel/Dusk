import { User, type UserResponseDTO } from "@/entities/user.js";

export interface UserDomain {
    create(user: User): Promise<UserResponseDTO>;
    findAll(): Promise<UserResponseDTO[]>;
    findByEmail(email: string): Promise<UserResponseDTO | null>;
}
