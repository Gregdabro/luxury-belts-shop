import express from "express"; // Импортируем Express для создания сервера
import cors from "cors"; // Импортируем CORS для работы с междоменными запросами
import dotenv from "dotenv"; // Импортируем dotenv для работы с переменными окружения
import connectDB from "./config/db.js"; // Импортируем функцию для подключения к базе данных
import productRoutes from "./routes/productRoutes.js"; // Импортируем маршруты для работы с товарами
import userRoutes from "./routes/userRoutes.js"; // Импортируем маршруты для работы с пользователями
import cookieParser from "cookie-parser"; // Импортируем cookie-parser для работы с куками
import errorMiddleware from "./middleware/errorMiddleware.js"; // Импортируем middleware для обработки ошибок

dotenv.config(); // Загружаем переменные окружения из файла .env
const app = express(); // Создаём новый экземпляр Express-приложения
const PORT = process.env.PORT || 5000; // Читаем порт из .env или используем 5000 по умолчанию

connectDB(); // Подключаемся к базе данных

app.use(cors()); // Включаем поддержку CORS для всех маршрутов
app.use(express.json()); // Разрешаем обработку JSON в запросах
app.use(cookieParser()); // Подключаем middleware для работы с куками

// Устанавливаем маршрут для товаров
app.use("/api/products", productRoutes);

// Устанавливаем маршрут для пользователей
app.use("/api/users", userRoutes);

// Устанавливаем обработчик ошибок
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Запускаем сервер и слушаем указанный порт
