import type { Request, Response } from "express";
import express from "express";
import { notFound } from "./middlewares/notFound.js";
import "dotenv/config";

import app from "./helpers/app.js";
const server = express();
server.use(express.json());

server.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});

server.use(notFound);

if (!process.env.PORT) {
    app.error("missing PORT");
    throw new Error("enviorment variable PORT is undefined");
}
server.listen(process.env.PORT, () => {
    app.log(`Server started on port ${process.env.PORT}`);
});
