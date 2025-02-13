import User from "../models/User.js";
import mailService from "./mailService.js";
import { v4 as uuidv4 } from "uuid";

class ActivationService {
  async sendActivationLink(email) {
    const activationLink = uuidv4(); // Генерируем уникальный идентификатор

    // Сохраняем ссылку в БД
    const user = await User.findOneAndUpdate(
      { email },
      { activationLink },
      { new: true }
    );

    if (!user) throw new Error("Пользователь не найден");

    const activationUrl = `${process.env.API_URL}/api/users/auth/activate/${activationLink}`;
    await mailService.sendActivationMail(email, activationUrl);
  }

  async activateAccount(link) {
    const user = await User.findOne({ activationLink: link });
    if (!user) throw new Error("Некорректная ссылка активации");

    user.isActivated = true;
    user.activationLink = null;
    await user.save();
  }
}

export default new ActivationService();
