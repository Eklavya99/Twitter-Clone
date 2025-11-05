import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

const authenticate = (req : Request, res : Response, next : NextFunction) => {
    const token = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return next(new AppError("No token provided", 401));
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    }
    catch(err){
        return next(new AppError("Invalid or expired token", 401));
    }
}

export default authenticate;