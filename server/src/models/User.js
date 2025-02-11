import mongoose from "mongoose";

// Определяем схему для пользователя
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Имя пользователя
  email: { type: String, required: true, unique: true }, // Email (уникальный)
  password: { type: String, required: true }, // Хешированный пароль
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Роль пользователя
}, { timestamps: true }); // timestamps автоматически добавит createdAt и updatedAt

// Создаём модель User
export default mongoose.model("User", UserSchema);
