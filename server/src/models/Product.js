import mongoose from "mongoose"; // Импортируем Mongoose для работы с MongoDB

// Определяем схему для модели Product
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Обязательное поле для названия товара
  description: String, // Описание товара
  price: { type: Number, required: true }, // Обязательное поле для цены товара
  image: String, // Ссылка на изображение товара
});

// Создаём модель Product, которая будет использовать схему ProductSchema
export default mongoose.model("Product", ProductSchema);
