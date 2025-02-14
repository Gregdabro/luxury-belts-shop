import jwt from "jsonwebtoken";
import Token from "../models/Token.js";
import ApiError from "../exceptions/apiError.js";

class TokenService {
  // Генерация access и refresh токенов
  generateTokens(payload) {
    try {
        if (!payload) {
            throw ApiError.badRequest('Отсутствуют данные для генерации токенов');
        }
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw ApiError.internal('Отсутствуют секретные ключи для токенов');
        }
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15s" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        return { accessToken, refreshToken };     
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ApiError.internal("Ошибка при генерации токенов");
    }
  }

  // Сохранение refresh-токена в БД
  async saveToken(userId, refreshToken) {
    try {
        if (!userId || !refreshToken) {
            throw ApiError.badRequest('Отсутствует ID пользователя или refresh token');
        }
        const tokenData = await Token.findOne({ user: userId });
        if (tokenData) {
          tokenData.refreshToken = refreshToken;
          return tokenData.save();
        }
        return await Token.create({ user: userId, refreshToken });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ApiError.internal("Ошибка при сохранении токена");
    }
  }

  // Валидация access-токена
  validateAccessToken(token) {
    try {
        if (!token) {
            return null;
        }
        if (!process.env.JWT_ACCESS_SECRET) {
            throw ApiError.internal('Отсутствует секретный ключ для access token');
        }
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
        return null;
    }
  }

  // Валидация refresh-токена
  validateRefreshToken(token) {
    try {
        if (!token) {
            return null;
        }
        if (!process.env.JWT_REFRESH_SECRET) {
            throw ApiError.internal('Отсутствует секретный ключ для refresh token');
        }
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
  }

  // Удаление refresh-токена из БД
  async removeToken(refreshToken) {
    try {
        if (!refreshToken) {
            throw ApiError.badRequest('Отсутствует refresh token');
        }
        const result = await Token.deleteOne({ refreshToken });
        if (result.deletedCount === 0) {
            throw ApiError.badRequest('Токен не найден');
        }
        return result;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ApiError.internal("Ошибка при удалении токена");
    }
  }

  // Найти refresh-токен в БД
  async findToken(refreshToken) {
    try {
        if (!refreshToken) {
            throw ApiError.badRequest('Отсутствует refresh token');
        }
        const token = await Token.findOne({ refreshToken });
        if (!token) {
            throw ApiError.unauthorized('Токен не найден');
        }
        return token;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw ApiError.internal("Ошибка при поиске токена");
    }
  }
}

export default new TokenService();
