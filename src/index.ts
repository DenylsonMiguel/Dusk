import type { Request, Response } from "express";
import express from "express";
import { notFound } from "./middlewares/notFound.js";
import "dotenv/config";

import { logger } from "./helpers/logger.js";
const app = express();
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.use(notFound);

if (!process.env.PORT) {
    logger.error("missing PORT");
    throw new Error("enviornment variable PORT is undefined");
}
app.listen(process.env.PORT, () => {
    logger.log(`Server started on port ${process.env.PORT}`);
});
