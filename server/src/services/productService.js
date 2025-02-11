import { Product } from "../models/Product.js";

class ProductService {
  // Метод для получения всех товаров из базы данных
  async getProducts() {
    return await Product.find(); // Получаем все документы из коллекции Product
  }

  // Метод для создания нового товара
  async createProduct(productData) {
    const product = new Product(productData); // Создаём экземпляр товара
    return await product.save(); // Сохраняем в базе данных и возвращаем созданный товар
  }
}

export default new ProductService(); // Экспортируем экземпляр класса, чтобы использовать его в контроллере
