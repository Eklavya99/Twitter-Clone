import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.get("/health", (req, res) => {
    res.json({ok : true});
})
app.use(errorHandler);

export default app;