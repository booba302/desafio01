import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
import CartManager from "../dao/mongo/cartManager.js";
import ProductModel from "../dao/models/products.schema.js";

const productMng = new ProductManager();
const cartMng = new CartManager();

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const products = await productMng.getProducts();
  res.render("home", { products });
});

viewsRouter.get("/products", async (req, res) => {
  const { limit = 10, page = 1, query, sort } = req.query;
  let order, filter;
  !query ? (filter = {}) : (filter = { category: query });
  sort == "asc" ? (order = 1) : sort == "desc" ? (order = -1) : (order = 0);
  const products = await ProductModel.paginate(filter, {
    limit: limit,
    page: page,
    sort: { price: order },
    lean: true,
  });
  console.log(products);
  res.render("products", { products });
});

viewsRouter.get("/carts/:idCart", async (req, res) => {
  const { idCart } = req.params;
  const productsInCart = await cartMng.getCartById(idCart);
  const products = productsInCart[0].products;
  res.render("cart", { idCart, products });
});

export default viewsRouter;
