import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Маршрут для регистрации
router.post("/register", userController.register);

// Маршрут для авторизации
router.post("/login", userController.login);
router.get("/", authMiddleware, roleMiddleware(["admin"]), userController.getAll);
router.get("/auth/activate/:link", userController.activate);

export default router;
