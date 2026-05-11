import type { Response } from "express";

export function respond(data: any, res: Response, status?: number) {
    res.status(status ?? 200).json(data);
}
