import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../exceptions/apiError.js";
import tokenService from "../services/tokenService.js";

// Middleware для проверки токена и получения пользователя
export default function authMiddleware(req, res, next) {
  try {
    // Получаем токен из заголовков запроса
    const authorizationHeader = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"

    if (!authorizationHeader) {
      return next(ApiError.unauthorized());
    }

    // Проверяем токен
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.unauthorized());
    }

    // Ищем пользователя в базе данных
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.unauthorized());
    }

    req.user = userData;
    next(); // Передаём управление следующему middleware
  } catch (error) {
    return next(ApiError.unauthorized());
  }
};
