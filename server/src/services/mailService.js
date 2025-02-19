// server/src/services/mailService.js
import "../config/loadEnv.js";

import nodemailer from "nodemailer";
import ApiError from "../exceptions/apiError.js";

class MailService {
  constructor() {
    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        throw ApiError.internal('Отсутствуют учетные данные SMTP');
      }
      
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при инициализации почтового сервиса');
    }
  }

  async sendActivationMail(to, link) {
    try {
      // Валидация входных данных
      if (!to) {
        throw ApiError.badRequest('Email получателя не указан');
      }
      if (!link) {
        throw ApiError.badRequest('Ссылка активации не указана');
      }

      // Проверка формата email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        throw ApiError.badRequest('Некорректный формат email');
      }

      // Проверка URL
      try {
        new URL(link);
      } catch {
        throw ApiError.badRequest('Некорректный формат ссылки активации');
      }

      if (!this.transporter) {
        throw ApiError.internal('Почтовый сервис не инициализирован');
      }

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: "Активация аккаунта",
        text: `Для активации аккаунта перейдите по ссылке: ${link}`,
        html: `
          <div>
            <h1>Для активации аккаунта перейдите по ссылке:</h1>
            <a href="${link}">${link}</a>
          </div>
        `,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при отправке письма активации');
    }
  }

  // Вспомогательный метод для проверки соединения с SMTP сервером
  async verifyConnection() {
    try {
      if (!this.transporter) {
        throw ApiError.internal('Почтовый сервис не инициализирован');
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при проверке соединения с SMTP сервером');
    }
  }
}

export default new MailService();
