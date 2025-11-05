import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";
import { SessionRepository } from "../repositories/session.repository";
const router = Router();
const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();
const authService = new AuthService(userRepo, sessionRepo);
const authController = new AuthController(authService);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logoutUser);

export default router;