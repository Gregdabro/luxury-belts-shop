import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Маршрут для регистрации
router.post("/register", userController.register);
// Маршрут для авторизации
router.post("/login", userController.login);
// Маршрут для выхода
router.post("/logout", userController.logout);
// Маршрут для обновления токена
router.get("/refresh", userController.refresh);
// Маршрут для получения списка пользователей
router.get("/", authMiddleware, userController.getAll);
// Маршрут для активации аккаунта
router.get("/auth/activate/:link", userController.activate);

export default router;
