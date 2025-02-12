import userService from "../services/userService.js";

class UserController {
  async register(req, res) {
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
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const userData = await userService.login(req.body.email, req.body.password);
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(userData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      await userService.logout(req.cookies.refreshToken);
      res.clearCookie("refreshToken");
      res.json({ message: "Вы успешно вышли" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async refresh(req, res) {
    try {
      const userData = await userService.refresh(req.cookies.refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json(userData);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default new UserController();
