import { Router } from "express";
import { ProductService } from "../application/ProductService";

const router = Router();
const productService = new ProductService();

router.get("/", async (req, res) => {
  const products = await productService.getAllProducts();
  res.json(products);
});

export default router;
