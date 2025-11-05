import {SessionRepository} from "../repositories/session.repository";

export class SessionService {
    private sessionRepository = new SessionRepository();

    async getActiveSessionsByUserId(userId: string) {
        return await this.sessionRepository.getActiveSessionsByUserId(userId);
    }

    async revokeSessionById(sessionID: string) {
        await this.sessionRepository.deleteSessionBySessionID(sessionID);
    }

    async revokeAllSessionsForUser(userId: string) {
        await this.sessionRepository.revokeAllUserSessions(userId);
    }
}