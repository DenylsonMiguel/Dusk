import type { Response } from "express";

export function respond<T>(data: T, res: Response, status?: number) {
    res.status(status ?? 200).json(data);
}
