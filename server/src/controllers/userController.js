import userService from "../services/userService.js";

class UserController {
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
