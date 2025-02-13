import userService from "../services/userService.js";
import activationService from "../services/activationService.js";
import ApiError from "../exceptions/apiError.js";

class UserController {
  async register(req, res, next) {
    try {
      const userData = await userService.register(req.body);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(201).json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const userData = await userService.login(req.body.email, req.body.password);
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.unauthorized('Пользователь не авторизован');
      }
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.json({ message: "Вы успешно вышли" });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.unauthorized('Пользователь не авторизован');
      }
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const { link } = req.params;
      if (!link) {
        throw ApiError.badRequest("Некорректный запрос. Отсутствует ссылка активации");
      }

      await activationService.activateAccount(link);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
