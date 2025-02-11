import bcrypt from "bcryptjs"; // Для хеширования паролей
import jwt from "jsonwebtoken"; // Для генерации JWT-токенов
import User from "../models/User.js";

// Класс UserService для работы с пользователями
class UserService {
  // Регистрация нового пользователя
  async register(userData) {
    const { name, email, password, role } = userData;

    // Проверяем, есть ли уже такой email в базе
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email уже зарегистрирован");

    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём нового пользователя
    const user = new User({ name, email, password: hashedPassword, role: role || "user" });
    await user.save();

    return user;
  }

  // Авторизация пользователя
  async login(email, password) {
    // Проверяем, существует ли пользователь с таким email
    const user = await User.findOne({ email });
    if (!user) throw new Error("Неверный email или пароль");

    // Проверяем совпадает ли пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Неверный email или пароль");

    // Генерируем JWT-токен
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Включаем в токен userId и role
      process.env.JWT_SECRET, // Секретный ключ из .env
      { expiresIn: "7d" } // Токен действует 7 дней
    );

    return { token, user };
  }
}

// Экспортируем экземпляр класса
export default new UserService();
