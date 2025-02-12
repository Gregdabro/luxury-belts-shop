import tokenService from "../services/tokenService.js";
import ApiError from "../exceptions/apiError.js";

export default function roleMiddleware(requiredRoles) {
  return function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      // Проверяем, есть ли заголовок Authorization
      if (!authHeader) {
        return next(ApiError.unauthorized("Токен отсутствует"));
      }

      // Проверяем, начинается ли заголовок с "Bearer "
      const parts = authHeader.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return next(ApiError.unauthorized("Некорректный формат токена"));
      }

      const accessToken = parts[1];

      // Валидация access-токена
      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.unauthorized("Неверный или просроченный токен"));
      }

      // Проверяем, есть ли у пользователя нужная роль
      if (!requiredRoles.includes(userData.role)) {
        return next(ApiError.forbidden("Нет доступа"));
      }

      req.user = userData;
      next();
    } catch (error) {
      return next(error);
    }
  };
}
