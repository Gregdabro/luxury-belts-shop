import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Маршрут для регистрации
router.post("/register", userController.register);

// Маршрут для авторизации
router.post("/login", userController.login);
router.get("/", userController.getAll);

export default router;
