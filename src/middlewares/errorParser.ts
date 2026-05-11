import type { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors/appError.js";
import { logger } from "../helpers/logger.js";

export function errorParser(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof AppError)
        return res
            .status(err.status)
            .json({ error: err.message, code: err.code });

    if (err instanceof SyntaxError && "body" in err)
        return res.status(400).json({
            error: "Invalid JSON",
            message: "O corpo da requisição precisa ser um JSON válido",
        });

    logger.error(`Error: ${err}`);

    return res
        .status(500)
        .json({ error: "Internal Server Error", code: "SERVER_ERROR" });
}
