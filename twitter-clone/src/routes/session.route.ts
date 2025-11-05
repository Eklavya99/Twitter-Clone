import Express  from "express";
import { SessionController } from "../controllers/session.controller";
import authenticate from "../middlewares/auth.middleware";
import { SessionService } from "../services/session.service";


const router = Express.Router();
const sessionService = new SessionService();
const sessionController = new SessionController(sessionService);

router.use(authenticate);
router.get("/" , sessionController.getActiveSessions);
router.delete("/:sessionID" , sessionController.revokeSession);
router.delete("/" , sessionController.revokeAllSessions);

export default router;