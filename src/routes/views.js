import { Router } from "express";
import ProductManager from "../dao/mongo/productManager.js";
import CartManager from "../dao/mongo/cartManager.js";
import { isLogged, protectView } from "../utils/secure.middleware.js";

const productMng = new ProductManager();
const cartMng = new CartManager();

const viewsRouter = Router();

viewsRouter.get("/", isLogged, async (req, res) => {
  res.redirect("login");
});

viewsRouter.get("/login", isLogged, async (req, res) => {
  res.render("login");
});

viewsRouter.get("/products", protectView, async (req, res) => {
  const { name, lastname, email, role } = req.user;
  const products = await productMng.getProducts();
  res.render("products", { products, name, lastname, email, role });
});

viewsRouter.get("/carts/:idCart", async (req, res) => {
  const { idCart } = req.params;
  const productsInCart = await cartMng.getCartById(idCart);
  const products = productsInCart[0].products;
  res.render("cart", { idCart, products });
});

export default viewsRouter;
