import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { UserRepository } from "../repositories/user.repository";
import {hashPassword, comparePassword} from "../utils/passwordUtils";
import { generateAccessToken, generateRefeshToken } from "../utils/tokenGenerator";
import { RegisterDTO, LoginDTO} from "../interfaces/auth.DTO";
import { SessionRepository } from "../repositories/session.repository";

export class AuthService {
    constructor(private userRepository: UserRepository, private sessionRepository : SessionRepository) {}

    async registerUser(data: RegisterDTO, req? : Request): Promise<any> {
        const existingUser = await this.userRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new AppError("User with this email already exists", 400);
        }
        const hashedPassword = await hashPassword(data.password);
        const newUser = await this.userRepository.createUser({
            username: data.username,
            email: data.email,
            password: hashedPassword
        });
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefeshToken(newUser);

        await this.createSession(newUser._id.toString(),
            refreshToken,
            req?.headers["user-agent"],
            req?.ip as string
        );

        return { 
            user : {id: newUser._id, email: newUser.email, username: newUser.username},
            tokens : {accessToken, refreshToken}
        };
    }

    async loginUser(data: LoginDTO, req? : Request): Promise<any> {
        const user =  await this.userRepository.findUserByEmail(data.email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }
        const isPasswordValid = await comparePassword(data.password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", 401);
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefeshToken(user);

        await this.createSession(user._id.toString(), refreshToken, req?.headers["user-agent"], req?.ip as string);

        return { 
            user : {id: user._id, email: user.email, username: user.username},
            tokens : {accessToken, refreshToken}
        };
    }

    async refreshTokens(refreshToken: string, req : Request) {
        if(!refreshToken){
            throw new AppError("Refresh token is required", 401);
        }
        const session = await this.sessionRepository.findByRefreshToken(refreshToken);
        if(!session || session.isRevoked){
            throw new AppError("Invalid refresh token", 403);
        }
        try{
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
            const user = await this.userRepository.findUserById(decoded.userId);
            if(!user){
                throw new AppError("User not found", 404);
            }
            await this.sessionRepository.revokeSession(refreshToken);
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefeshToken(user);
            await this.createSession(user._id.toString(), newRefreshToken, req?.headers["user-agent"], req?.ip as string);
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        }
        catch(err){
            throw new AppError("Invalid refresh token", 403);
        }
    }

    async logoutUser(refreshToken: string) {
        if(refreshToken){
            await this.sessionRepository.revokeSession(refreshToken);
        }
        return {message: "Logged out successfully" };
    }

    private async createSession(userId: string, refreshToken: string, userAgent?: string, ipAddress?: string) {
        const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 days
        await this.sessionRepository.createSession({
            userId,
            refreshToken,
            userAgent,
            ipAddress,
            expiresAt,
        })
    }
}