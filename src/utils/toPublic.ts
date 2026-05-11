import type { PublicUser, UserResponseDTO } from "../entities/user.js";

export function toPublic(u: UserResponseDTO): PublicUser {
    return {
        id: u._id,
        name: u.name,
        email: u.email,
    };
}
