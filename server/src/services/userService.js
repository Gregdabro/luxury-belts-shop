import bcrypt from "bcryptjs";
import User from "../models/User.js";
import tokenService from "./tokenService.js";
import UserDto from "../dtos/userDto.js";

class UserService {
  async register(userData) {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email уже зарегистрирован");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || "user" });

    // Создаём DTO, чтобы не возвращать лишние данные
    const userDto = new UserDto(user);
    
    // Генерируем токены
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Неверный email или пароль");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Неверный email или пароль");

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("Токен отсутствует");

    const tokenData = tokenService.validateRefreshToken(refreshToken);
    const storedToken = await tokenService.findToken(refreshToken);
    if (!tokenData || !storedToken) throw new Error("Неверный токен");

    const user = await User.findById(tokenData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

export default new UserService();
