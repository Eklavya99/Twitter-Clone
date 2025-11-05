import { ISession, ISessionCreate } from "../interfaces/session.interface";
import {sessionModel} from "../models/session.model";

export class SessionRepository {
    
    async createSession(sessionData: ISessionCreate): Promise<ISession> {
        const session = new sessionModel(sessionData);
        return await session.save();
    }

    async findByRefreshToken(refreshToken: string): Promise<ISession | null> {
        return await sessionModel.findOne({ refreshToken });
    }

    async revokeSession(refreshToken: string): Promise<void> {
        await sessionModel.updateOne({refreshToken: refreshToken}, {$set: {isRevoked: true}});
    }

    async revokeAllUserSessions(userId: string): Promise<void> {
        await sessionModel.updateMany({userId}, {$set: {isRevoked: true}});
    }

    async getActiveSessionsByUserId(userId: string): Promise<ISession[]> {
        return await sessionModel.find({userId, isRevoked: false});
    }

    async deleteSessionBySessionID(sessionID: string): Promise<void> {
        await sessionModel.findByIdAndUpdate(sessionID, {$set: {isRevoked: true}});
    }

}