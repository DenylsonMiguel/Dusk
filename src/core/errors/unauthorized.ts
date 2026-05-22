import { AppError } from "./appError.js";

class Unauthorized extends AppError {
    constructor(message: string) {
        super(message, "UNAUTHORIZED", 401);
    }
}

export default Unauthorized;
