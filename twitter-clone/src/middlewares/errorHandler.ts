import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : "Internal server error";
    if (status >= 500) console.error(err);
    res.status(status).json({ error: message });
}