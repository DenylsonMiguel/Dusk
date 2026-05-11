import { z } from "zod";

const createUserSchema = z.object({
    name: z.string().trim().min(3, "Very short name").max(50, "Very long name"),
    email: z.email().max(50),
    password: z
        .string()
        .refine((s) => !s.includes(" "), "No Spaces")
        .min(6, "Password too short")
        .max(30, "Password too long"),
});

export default createUserSchema;
