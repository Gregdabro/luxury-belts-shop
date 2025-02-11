import { Product } from "../models/Product.js";

class ProductController {
    async createProduct(req, res) {
        try {
            const product = new Product(req.body);
            await product.save();
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    async getProducts(req, res) {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            res.status(500).json(error.message);
        }
    }
}

export default new ProductController();