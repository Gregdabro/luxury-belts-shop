import bcrypt from "bcryptjs";
import User from "../models/User.js";
import tokenService from "./tokenService.js";
import UserDto from "../dtos/userDto.js";
import ApiError from "../exceptions/apiError.js";
import activationService from "./activationService.js";

class UserService {
  async register(userData) {
    const { name, email, password, role } = userData;

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) throw ApiError.badRequest("Email уже зарегистрирован");

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 7);


    // Создаём нового пользователя
    const user = await User.create({ name, email, password: hashedPassword, role: role || "user" });

    await activationService.sendActivationLink(email);

    // Создаём DTO, чтобы не возвращать лишние данные
    const userDto = new UserDto(user);
    
    // Генерируем токены и сохраняем refreshToken в БД
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    // Проверяем, существует ли пользователь с таким email
    const user = await User.findOne({ email });
    if (!user) throw ApiError.unauthorized("Неверный email или пароль");

    // Проверяем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw ApiError.unauthorized("Неверный email или пароль");

    // Создаём DTO, чтобы не возвращать лишние данные
    const userDto = new UserDto(user);

    // Генерируем токены и сохраняем refreshToken в БД
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    if (!refreshToken) throw ApiError.badRequest("Токен отсутствует");
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.badRequest("Токен отсутствует");

    // Проверяем валидность токена
    const tokenData = tokenService.validateRefreshToken(refreshToken);
    const storedToken = await tokenService.findToken(refreshToken);
    if (!tokenData || !storedToken) throw ApiError.unauthorized("Неверный токен");

    // Проверяем, существует ли пользователь по токену
    const user = await User.findById(tokenData.id);
    if (!user) throw ApiError.unauthorized("Неверный токен");

    // Генерируем новые токены
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAll() {
    const users = await User.find();
    if (!users) throw ApiError.badRequest("Пользователи не найдены");
    return users.map((user) => new UserDto(user));
  }
}

export default new UserService();