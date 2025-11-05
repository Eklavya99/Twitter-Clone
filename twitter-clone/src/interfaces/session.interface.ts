import mongoose from "mongoose";

export interface ISession extends mongoose.Document {
    userId: string;
    refreshToken: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISessionCreate {
    userId: string;
    refreshToken: string;
    userAgent?: string | undefined;
    ipAddress?: string | undefined;
    expiresAt: Date;
    isRevoked?: boolean | undefined;
}

