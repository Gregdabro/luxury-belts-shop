import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware для проверки токена и получения пользователя
export const authMiddleware = async (req, res, next) => {
  try {
    // Получаем токен из заголовков запроса
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Нет доступа, авторизуйтесь" });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ищем пользователя в базе данных
    req.user = await User.findById(decoded.userId).select("-password"); // Исключаем пароль
    if (!req.user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    next(); // Передаём управление следующему middleware
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
};
