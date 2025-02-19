import User from "../models/User.js";
import UserDto from "../dtos/userDto.js";
import ApiError from "../exceptions/apiError.js";
class UserService {
  async getAll() {
    const users = await User.find();
    if (!users) throw ApiError.badRequest("Пользователи не найдены");
    return users.map((user) => new UserDto(user));
  }
}
export default new UserService();