import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

class TokenService {
  // Генерация access и refresh токенов
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return { accessToken, refreshToken };
  }

  // Сохранение refresh-токена в БД
  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await Token.create({ user: userId, refreshToken });
  }

  // Валидация access-токена
  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Валидация refresh-токена
  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Удаление refresh-токена из БД (например, при выходе пользователя)
  async removeToken(refreshToken) {
    return await Token.deleteOne({ refreshToken });
  }

  // Найти refresh-токен в БД
  async findToken(refreshToken) {
    return await Token.findOne({ refreshToken });
  }
}

export default new TokenService();
