import z from "zod";

const loginSchema = z.object({
    email: z.email().max(50, "Email too long"),
    password: z
        .string()
        .refine((s) => !s.includes(" "), "No Spaces")
        .min(6, "Password too short")
        .max(30, "Password too long"),
});

export default loginSchema;
