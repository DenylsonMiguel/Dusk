import { z } from "zod";
import type { Response } from "express";

export function parse<T>(result: z.ZodSafeParseResult<T>, res: Response) {
    if (result.success) return;
    res.status(400).json({
        code: "BAD_REQUEST",
        errors: result.error.issues.map((err) => {
            return { error: err.message, path: err.path[0] ?? "unknown" };
        }),
    });
}
