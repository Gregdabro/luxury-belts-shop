import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../exceptions/apiError.js";
import mailService from "./mailService.js";


class ActivationService {
  async sendActivationLink(email) {
    try {
      // Валидация email
      if (!email) {
        throw ApiError.badRequest('Email не указан');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw ApiError.badRequest('Некорректный формат email');
      }

      // Проверка наличия API_URL
      if (!process.env.API_URL) {
        throw ApiError.internal('Отсутствует конфигурация API_URL');
      }

      const activationLink = uuidv4();

      // Сохраняем ссылку в БД
      const user = await User.findOneAndUpdate(
        { email },
        { activationLink },
        { new: true }
      );

      if (!user) {
        throw ApiError.notFound('Пользователь не найден');
      }

      // Проверяем, не активирован ли уже аккаунт
      if (user.isActivated) {
        throw ApiError.badRequest('Аккаунт уже активирован');
      }

      const activationUrl = `${process.env.API_URL}/api/auth/activate/${activationLink}`;
      
      await mailService.sendActivationMail(email, activationUrl);
      
      return { message: 'Ссылка активации успешно отправлена' };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при отправке ссылки активации');
    }
  }

  async activateAccount(link) {
    try {
      // Валидация ссылки активации
      if (!link) {
        throw ApiError.badRequest('Отсутствует ссылка активации');
      }

      // Проверка формата UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(link)) {
        throw ApiError.badRequest('Некорректный формат ссылки активации');
      }

      const user = await User.findOne({ activationLink: link });
      
      if (!user) {
        throw ApiError.badRequest('Некорректная ссылка активации');
      }

      if (user.isActivated) {
        throw ApiError.badRequest('Аккаунт уже активирован');
      }

      user.isActivated = true;
      user.activationLink = null;
      await user.save();

      return { message: 'Аккаунт успешно активирован' };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при активации аккаунта');
    }
  }
}

export default new ActivationService();
