import { UserRepository } from "../../repositories/user/repository.js";
import { AuthService } from "./auth.service.js";
import { Router, type Request, type Response } from "express";
import createUserSchema from "../../helpers/schemas/createUser.js";
import { parse } from "../../utils/parse.js";
import { respond } from "../../core/respond.js";

export class AuthController {
    constructor(private service: AuthService) {}

    register = async (req: Request, res: Response) => {
        const result = createUserSchema.safeParse(req.body);
        if (!result.success) return parse(result, res);

        const newUser = await this.service.register(result.data);

        return respond({ code: "CREATED", user: newUser }, res);
    };
}

const authRoutes = Router();
const controller = new AuthController(new AuthService(new UserRepository()));

authRoutes.post("/register", controller.register);

export default authRoutes;
