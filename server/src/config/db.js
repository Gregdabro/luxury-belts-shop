import mongoose from "mongoose"; // Импортируем Mongoose для подключения к базе данных
import dotenv from "dotenv"; // Импортируем dotenv для работы с переменными окружения

dotenv.config(); // Загружаем переменные окружения из файла .env

// Функция для подключения к базе данных MongoDB
export default async () => {
  try {
    // Пытаемся подключиться к базе данных с использованием строки подключения из переменной окружения
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected"); // Выводим сообщение об успешном подключении
  } catch (error) {
    console.error("DB Connection Error:", error); // Если ошибка при подключении, выводим её в консоль
    process.exit(1); // Завершаем процесс с кодом 1 (ошибка), чтобы сервер не продолжал работать без подключения к БД
  }
};
