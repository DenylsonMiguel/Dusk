import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../auth.service.js";
import type { UserRepository } from "../../../repositories/user/repository.js";
import type { UserResponseDTO } from "../../../entities/user.js";
import { Conflict } from "../../../core/errors/conflict.js";

// Mocka o bcrypt inteiro
vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn().mockResolvedValue("hashed_password"),
    },
}));

import bcrypt from "bcryptjs";

const mockRepository = {
    create: vi.fn(),
    findByEmail: vi.fn(),
    findAll: vi.fn(),
} as unknown as UserRepository;

const service = new AuthService(mockRepository);

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
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe("AuthService.register", () => {
    it("should create a user and return public data", async () => {
        vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(mockRepository.create).mockResolvedValue(fakeDbUser);

        const result = await service.register(userData);

        expect(result).toEqual({
            id: "abc123",
            name: "Deny",
            email: "deny@email.com",
        });
    });

    it("should throw Conflict if the email is already registered", async () => {
        vi.mocked(mockRepository.findByEmail).mockResolvedValue(fakeDbUser);

        await expect(service.register(userData)).rejects.toThrow(Conflict);
    });

    it("should not return the password in the result", async () => {
        vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(mockRepository.create).mockResolvedValue(fakeDbUser);

        const result = await service.register(userData);

        expect(result).not.toHaveProperty("password");
    });

    it("should hash the password before saving", async () => {
        vi.mocked(mockRepository.findByEmail).mockResolvedValue(null);
        vi.mocked(mockRepository.create).mockResolvedValue(fakeDbUser);

        await service.register(userData);

        expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 15);
        const savedPassword = vi.mocked(mockRepository.create).mock
            .calls[0]?.[0].password;
        expect(savedPassword).not.toBe(userData.password);
    });
});
