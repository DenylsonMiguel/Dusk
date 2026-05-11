import { AppError } from "./appError.js";

export class BadRequest extends AppError {
    constructor(message: string) {
        super(message, "BAD_REQUEST", 400);
    }
}
