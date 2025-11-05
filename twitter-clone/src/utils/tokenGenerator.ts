import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";

export const generateAccessToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "3h" }
    );
}

export const generateRefeshToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
        { expiresIn: "30d" }
    );
}