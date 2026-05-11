export class AppError extends Error {
    status: number;
    code: string;

    constructor(message: string, code: string, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }
}
