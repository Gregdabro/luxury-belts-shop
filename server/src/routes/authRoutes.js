import express from "express";
import authController from "../controllers/authController.js";
import { registerValidation, loginValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Маршрут для регистрации
router.post("/register", registerValidation, authController.register);
// Маршрут для авторизации
router.post("/login", loginValidation, authController.login);
// Маршрут для выхода
router.post("/logout", authController.logout);
// Маршрут для обновления токена
router.get("/refresh", authController.refresh);
// Маршрут для активации аккаунта
router.get("/activate/:link", authController.activate);

export default router;
