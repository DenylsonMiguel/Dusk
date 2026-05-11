import { AppError } from "./appError.js";

export class Conflict extends AppError {
    constructor(message: string) {
        super(message, "CONFLICT", 409);
    }
}
