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
    }): Promise<{ accesstoken: string; refreshtoken: string }> {
        const user = await this.userRepository.findByEmail(data.email);

        if (!user) throw new Unauthorized("Invalid email or password");

        if (user.lockUntil && user.lockUntil > Date.now()) {
            throw new Unauthorized("Account locked. Please try again later.");
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            await this.userRepository.incLoginAttempts(user._id);

            if (user.loginAttempts + 1 >= 5) {
                const lockUntil = Date.now() + 15 * 60 * 1000;
                await this.userRepository.lockAccount(user._id, lockUntil);
                throw new Unauthorized("Account locked. Please try again later.");
            }

            throw new Unauthorized("Invalid email or password");
        }

        if (user.loginAttempts > 0 || user.lockUntil) {
            await this.userRepository.resetLoginAttempts(user._id);
        }

        if (!process.env.ACCESS_SECRET) {
            logger.error("Environment variable ACCESS_SECRET is missing");
            throw new Error("Environment variable ACCESS_SECRET not found");
        }

        const accesstoken = jwt.sign(
            {
                email: user.email,
                id: user._id,
                name: user.name,
            },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" },
        );

        const refreshtoken = await this.refreshTokenRepository.create(
            user!._id as unknown as string,
        );

        return {
            accesstoken,
            refreshtoken,
        };
    }

}
