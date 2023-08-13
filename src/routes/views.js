import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";

const productMng = new ProductManager();

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const products = await productMng.getProducts();
  console.log(products);
  res.render("home", { products });
});

export default viewsRouter;
