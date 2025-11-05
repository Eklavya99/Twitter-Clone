import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    constructor(private authService : AuthService) {}

    registerUser = async (req: Request, res: Response, next : NextFunction) => {
            try{
                const result = await this.authService.registerUser(req.body, req);
                this.setAuthCookies(res, result.tokens);
                res.status(201).json({ success: true, data: result });
            }
            catch(err){
                next(err);
            }
    }

    loginUser = async (req: Request, res: Response, next : NextFunction) => {
        try{
            const result = await this.authService.loginUser(req.body, req);
            this.setAuthCookies(res, result.tokens);
            res.status(200).json({ success: true, data: result });
        }
        catch(err){
            next(err);
        }
    }

    logoutUser = async (req: Request, res: Response, next : NextFunction) => {
        await this.authService.logoutUser(req.cookies?.refreshToken);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    }

    refreshToken = async (req: Request, res: Response, next : NextFunction) => {
        try{
            const refreshToken = req.cookies?.refreshToken;
            const newTokens = await this.authService.refreshTokens(refreshToken, req);
            this.setAuthCookies(res, newTokens);
            res.status(200).json({ success: true, data: newTokens });
        }
        catch(err){
            next(err);
        }
    }

    private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
        });
    }
}