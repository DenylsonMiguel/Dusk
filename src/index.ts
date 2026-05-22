import express, { type Request, type Response } from "express";
import { notFound } from "./middlewares/notFound.js";
import "dotenv/config";
import authRoutes from "./modules/auth/auth.controller.js";
import { logger } from "./helpers/logger.js";
import { initDb } from "./config/database.js";
import { errorParser } from "./middlewares/errorParser.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./src/config/swagger/swagger.yaml");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

if (!process.env.CORS)
    logger.warn(
        "The CORS environment variable is missing; cors * is being used",
    );
app.use(
    cors({
        origin: process.env.CORS ?? "*",
        optionsSuccessStatus: 200,
    }),
);

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});
app.use("/auth", authRoutes);

app.use("/docs", swaggerUi.serve);
app.get("/docs", swaggerUi.setup(swaggerDocument));

app.use(notFound);
app.use(errorParser);

initDb();

if (!process.env.PORT) {
    logger.error("missing PORT");
    throw new Error("environment variable PORT is undefined");
}
app.listen(process.env.PORT, () => {
    logger.info(`Server started on port ${process.env.PORT}`);
});
