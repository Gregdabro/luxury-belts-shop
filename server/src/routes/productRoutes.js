import express from "express";
import ProductController from "../controllers/productController.js";

const router = express.Router();

// GET-запрос для получения списка всех товаров
router.get("/", ProductController.getProducts);

// POST-запрос для создания нового товара
router.post("/", ProductController.createProduct);

export default router; // Экспортируем маршруты для подключения в сервере
