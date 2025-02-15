import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Маршрут для получения списка пользователей
router.get("/", authMiddleware, authController.getAll);

export default router;
