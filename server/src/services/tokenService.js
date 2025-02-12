import jwt from "jsonwebtoken";
import Token from "../models/Token.js";
import ApiError from "../exceptions/apiError.js";

class TokenService {
  // Генерация access и refresh токенов
  generateTokens(payload) {
    try {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        return { accessToken, refreshToken };     
    } catch (error) {
        throw ApiError.internal("Ошибка при генерации токенов");
    }
  }

  // Сохранение refresh-токена в БД
  async saveToken(userId, refreshToken) {
    try {
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
          tokenData.refreshToken = refreshToken;
          return tokenData.save();
        }
        return await Token.create({ user: userId, refreshToken });
    } catch (error) {
      throw ApiError.internal("Ошибка при сохранении токена");
    }

  }

  // Валидация access-токена
  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      throw ApiError.unauthorized("Некорректный или просроченный access-токен");
    }
  }

  // Валидация refresh-токена
  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw ApiError.unauthorized("Неверный токен");
    }
  }

  // Удаление refresh-токена из БД
  async removeToken(refreshToken) {
    try {
      return await Token.deleteOne({ refreshToken });
    } catch (error) {
      throw ApiError.internal("Ошибка при удалении токена");
    }
  }

  // Найти refresh-токен в БД
  async findToken(refreshToken) {
    try {
      return await Token.findOne({ refreshToken });
    } catch (error) {
      throw ApiError.internal("Ошибка при поиске токена");
    }
  }
}

export default new TokenService();
