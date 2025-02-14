import Product from "../models/Product.js";
import ApiError from "../exceptions/apiError.js";

class ProductService {
  // Метод для получения всех товаров из базы данных
  async getProducts() {
    try {
      const products = await Product.find();
      if (!products || products.length === 0) {
        throw ApiError.notFound('Товары не найдены');
      }
      return products;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при получении товаров');
    }
  }

  // Метод для создания нового товара
  async createProduct(productData) {
    try {
      if (!productData) {
        throw ApiError.badRequest('Отсутствуют данные товара');
      }

      // Проверяем обязательные поля
      const requiredFields = ['name', 'price', 'description'];
      for (const field of requiredFields) {
        if (!productData[field]) {
          throw ApiError.badRequest(`Отсутствует обязательное поле: ${field}`);
        }
      }

      // Валидация цены
      if (typeof productData.price !== 'number' || productData.price <= 0) {
        throw ApiError.badRequest('Некорректная цена товара');
      }

      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        throw ApiError.badRequest('Товар с таким названием уже существует');
      }

      const product = new Product(productData);
      const savedProduct = await product.save();
      
      if (!savedProduct) {
        throw ApiError.internal('Ошибка при сохранении товара');
      }
      
      return savedProduct;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.internal('Ошибка при создании товара');
    }
  }
}

export default new ProductService();
