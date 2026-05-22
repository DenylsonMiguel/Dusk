import jwt from "jsonwebtoken";
import { Conflict } from "../../core/errors/conflict.js";
import Unauthorized from "../../core/errors/unauthorized.js";
import type { PublicUser, User } from "../../entities/user.js";
import { RefreshTokenRepository } from "../../repositories/refreshToken/repository.js";
import type { UserRepository } from "../../repositories/user/repository.js";
import { toPublic } from "../../utils/toPublic.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { logger } from "../../helpers/logger.js";

export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepository: RefreshTokenRepository,
    ) {}

    async register(data: User): Promise<PublicUser> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser)
            throw new Conflict("User with this email already exists");

        const hashedPassword = await bcrypt.hash(data.password, 15);

        const user = await this.userRepository.create({
            ...data,
            password: hashedPassword,
        });

        return toPublic(user);
    }

    async login(data: {
        email: string;
        password: string;
    }): Promise<{ access: string; refresh: string }> {
        const user = await this.userRepository.findByEmail(data.email);

        let invalidCredentials = false;
        if (!user) invalidCredentials = true;

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user ? user.password : "",
        );

        if (invalidCredentials || !isPasswordValid)
            throw new Unauthorized("Invalid email or password");

        if (!process.env.ACCESS_SECRET) {
            logger.error("Environment variable ACCESS_SECRET is missing");
            throw new Error("Environment variable ACCESS_SECRET not found");
        }

        const access = jwt.sign(
            {
                email: user!.email,
                id: user!._id as unknown as string,
                name: user!.name,
            },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" },
        );

        const refresh = await this.refreshTokenRepository.create(
            user!._id as unknown as string,
        );

        return {
            access,
            refresh,
        };
    }
}
