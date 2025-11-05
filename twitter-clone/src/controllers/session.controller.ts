import { Request, Response } from "express";
import { SessionService } from "../services/session.service";

export class SessionController {
    constructor(private sessionService : SessionService) {}

    getActiveSessions = async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const sessions = await this.sessionService.getActiveSessionsByUserId(userId);
        res.status(200).json({ success: true, data: sessions });
    }

    revokeSession = async (req: Request, res: Response) => {
        const sessionID = req.params.sessionID;
        if (!sessionID) {
            return res.status(400).json({ success: false, message: "sessionID is required" });
        }
        await this.sessionService.revokeSessionById(sessionID);
        res.status(200).json({ success: true, message: "Session revoked successfully" });
    }

    revokeAllSessions = async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        await this.sessionService.revokeAllSessionsForUser(userId);
        res.status(200).json({ success: true, message: "All sessions revoked successfully" });
    }
}