import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { AuthService } from "../auth.service.js";
import type { UserRepository } from "../../../repositories/user/repository.js";
import type { UserResponseDTO } from "../../../entities/user.js";
import { Conflict } from "../../../core/errors/conflict.js";

vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn().mockResolvedValue("hashed_password"),
        compare: vi.fn(),
    },
}));

import bcrypt from "bcryptjs";
import type { RefreshTokenRepository } from "../../../repositories/refreshToken/repository.js";
import Unauthorized from "../../../core/errors/unauthorized.js";

const mockUserRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findAll: vi.fn(),
    incLoginAttempts: vi.fn(),
    resetLoginAttempts: vi.fn(),
    lockAccount: vi.fn(),
} as unknown as UserRepository;
const mockRefreshTokenRepository = {
    create: vi.fn(),
    findByToken: vi.fn(),
} as unknown as RefreshTokenRepository;

const service = new AuthService(mockUserRepository, mockRefreshTokenRepository);

const userData = {
    name: "Deny",
    email: "deny@email.com",
    password: "senha123",
};

const fakeDbUser: UserResponseDTO = {
    _id: "abc123",
    name: "Deny",
    email: "deny@email.com",
    password: "hashed_password",
    loginAttempts: 0,
};

beforeEach(() => {
    vi.clearAllMocks();
});

beforeAll(() => {
    process.env.ACCESS_SECRET = "test-access-secret";
    process.env.REFRESH_SECRET = "test-refresh-secret";
});

describe("AuthService.register", () => {
    it("should create a user and return public data", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(mockUserRepository.create).mockResolvedValue(fakeDbUser);

        const result = await service.register(userData);

        expect(result).toEqual({
            id: "abc123",
            name: "Deny",
            email: "deny@email.com",
        });
    });

    it("should throw Conflict if the email is already registered", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeDbUser);

        await expect(service.register(userData)).rejects.toThrow(Conflict);
    });

    it("should not return the password in the result", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(mockUserRepository.create).mockResolvedValue(fakeDbUser);

        const result = await service.register(userData);

        expect(result).not.toHaveProperty("password");
    });

    it("should hash the password before saving", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(mockUserRepository.create).mockResolvedValue(fakeDbUser);

        await service.register(userData);

        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 15);
        const savedPassword = vi.mocked(mockUserRepository.create).mock
            .calls[0]?.[0].password;
        expect(savedPassword).not.toBe(userData.password);
    });
});

describe("AuthService.login", () => {
    it("should throw Unauthorized if the email is not found", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null);

        await expect(
            service.login({
                email: "nonexistent@email.com",
                password: "abc123",
            }),
        ).rejects.toThrow(Unauthorized);
    });

    it("should throw Unauthorized if the password is incorrect", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeDbUser);
        vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

        await expect(
            service.login({
                email: "deny@email.com",
                password: "wrong_password",
            }),
        ).rejects.toThrow(Unauthorized);
        expect(mockUserRepository.incLoginAttempts).toHaveBeenCalledWith(fakeDbUser._id);
    });

    it("should return access and refresh tokens on successful login", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeDbUser);
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
        vi.mocked(mockRefreshTokenRepository.create).mockResolvedValue(
            "fake_refresh_token",
        );

        const result = await service.login({
            email: "deny@email.com",
            password: "senha123",
        });

        expect(result).toMatchObject({
            accesstoken: expect.any(String),
            refreshtoken: expect.any(String),
        });
    });

    it("should call refreshTokenRepository.create with the correct user", async () => {
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(fakeDbUser);
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
        vi.mocked(mockRefreshTokenRepository.create).mockResolvedValue(
            "some_token",
        );

        await service.login({ email: "deny@email.com", password: "senha123" });

        expect(mockRefreshTokenRepository.create).toHaveBeenCalledWith(
            fakeDbUser._id,
        );
    });

    it("should throw Unauthorized if the account is locked", async () => {
        const lockedUser = { ...fakeDbUser, lockUntil: Date.now() + 10000 };
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(lockedUser);

        await expect(
            service.login({
                email: "deny@email.com",
                password: "senha123",
            }),
        ).rejects.toThrow("Account locked. Please try again later.");
    });

    it("should lock the account after 5 failed attempts", async () => {
        const almostLockedUser = { ...fakeDbUser, loginAttempts: 4 };
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(almostLockedUser);
        vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

        await expect(
            service.login({
                email: "deny@email.com",
                password: "wrong_password",
            }),
        ).rejects.toThrow("Account locked. Please try again later.");

        expect(mockUserRepository.lockAccount).toHaveBeenCalled();
    });

    it("should reset login attempts on successful login", async () => {
        const userWithAttempts = { ...fakeDbUser, loginAttempts: 2 };
        vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(userWithAttempts);
        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
        vi.mocked(mockRefreshTokenRepository.create).mockResolvedValue("token");

        await service.login({ email: "deny@email.com", password: "senha123" });

        expect(mockUserRepository.resetLoginAttempts).toHaveBeenCalledWith(fakeDbUser._id);
    });
});
