import ProductService from "../services/productService.js";
import ApiError from "../exceptions/apiError.js";

class ProductController {
    async getProducts(req, res, next) {
        try {
            const products = await ProductService.getProducts();
            res.json(products);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async createProduct(req, res, next) {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

export default new ProductController();