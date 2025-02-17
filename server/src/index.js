import "./config/config.js";
import express from "express"; // Импорт Express для создания сервера
import cors from "cors"; // Импортируем CORS для работы с междоменными запросами
import connectDB from "./config/db.js"; // Импортируем функцию для подключения к базе данных
import productRoutes from "./routes/productRoutes.js"; // Импортируем маршруты для работы с товарами
import authRoutes from "./routes/authRoutes.js"; // Импортируем маршруты для авторизации
import userRoutes from "./routes/userRoutes.js"; // Импортируем маршруты для работы с пользователями
import cookieParser from "cookie-parser"; // Импортируем cookie-parser для работы с куками
import errorMiddleware from "./middleware/errorMiddleware.js"; // Импортируем middleware для обработки ошибок
connectDB(); // Подключаемся к базе данных

const app = express(); // Создаём новый экземпляр Express-приложения
const PORT = process.env.PORT || 5000; // Читаем порт из .env или используем 5000 по умолчанию


app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
})); // Включаем поддержку CORS для всех маршрутов
app.use(express.json()); // Разрешаем обработку JSON в запросах
app.use(cookieParser()); // Подключаем middleware для работы с куками

// Устанавливаем маршрут для товаров
app.use("/api/products", productRoutes);

// Устанавливаем маршрут для авторизации
app.use("/api/auth", authRoutes);

// Устанавливаем маршрут для пользователей
app.use("/api/users", userRoutes);

// Устанавливаем обработчик ошибок
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Запускаем сервер и слушаем указанный порт
