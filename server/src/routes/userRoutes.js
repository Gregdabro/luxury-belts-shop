import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Маршрут для получения списка пользователей
router.get("/", authMiddleware, userController.getAll);

export default router;
