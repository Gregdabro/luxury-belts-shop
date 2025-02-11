import userService from "../services/userService.js";

// Класс UserController для обработки запросов
class UserController {
  // Регистрация пользователя
  async register(req, res) {
    try {
      const user = await userService.register(req.body);
      res.status(201).json({ message: "Пользователь зарегистрирован", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Авторизация пользователя
  async login(req, res) {
    try {
      const { token, user } = await userService.login(req.body.email, req.body.password);
      res.json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// Экспортируем экземпляр класса
export default new UserController();
