import { Conflict } from "../../core/errors/conflict.js";
import type { PublicUser, User, UserResponseDTO } from "../../entities/user.js";
import type { UserRepository } from "../../repositories/user/repository.js";
import { toPublic } from "../../utils/toPublic.js";
import bcrypt from "bcryptjs";

export class AuthService {
    constructor(private repository: UserRepository) {}

    async register(data: User): Promise<PublicUser> {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser)
            throw new Conflict("User with this email already exists");

        const hashedPassword = await bcrypt.hash(data.password, 15);

        const user = await this.repository.create({
            ...data,
            password: hashedPassword,
        });

        return toPublic(user);
    }
}
