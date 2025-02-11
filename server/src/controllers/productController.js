import ProductService from "../services/productService.js";

class ProductController {
  // Метод для обработки запроса на получение всех товаров
  async getProducts(req, res) {
    try {
      const products = await ProductService.getProducts(); // Вызываем сервисный метод
      res.json(products); // Отправляем клиенту список товаров
    } catch (error) {
      res.status(500).json({ error: error.message }); // В случае ошибки отправляем статус 500
    }
  }

  // Метод для обработки запроса на создание нового товара
  async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body); // Передаём данные товара в сервис
      res.status(201).json(product); // Отправляем клиенту созданный товар
    } catch (error) {
      res.status(500).json({ error: error.message }); // В случае ошибки отправляем статус 500
    }
  }
}

export default new ProductController(); // Экспортируем экземпляр класса для использования в маршрутах
