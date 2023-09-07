import fs from "fs";
import __dirname from "../../config/dirname.js";
import { v4 as uuidv4 } from "uuid";

import ProductManager from "./productManager.js";
const productMng = new ProductManager();

export default class CartManager {
  constructor() {
    this.cart = [];
    this.path = `${__dirname}/../db/cart.json`;
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.cart),
        "utf-8"
      );
      const data = await fs.promises.readFile(this.path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    }
  }

  async addCart() {
    const carts = await this.getCarts();
    const id = uuidv4();
    try {
      const cart = {
        id: id,
        products: [],
      };
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
      return cart;
    } catch (error) {
      console.log("error: " + error);
      throw new Error("Couldn't be created");
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const findCart = carts.find((cart) => cart.id == id);

    if (!findCart) {
      console.log("No se encuentra el carrito");
      throw new Error("Cart Not found");
    } else {
      return findCart;
    }
  }

  async addProductToCart(idCart, idProd) {
    try {
      const carts = await this.getCarts();
      const findCart = carts.find((cart) => cart.id == idCart);
      const findPrdt = await productMng.getProductById(idProd);

      if (!findCart || !findPrdt) throw new Error("Not found");

      const findProductsInCart = findCart.products.find(
        (prod) => (prod.id == idProd)
      );
      if (!findProductsInCart) {
        findCart.products.push({ id: findPrdt.id, quantity: 1 });
      } else findProductsInCart.quantity++;

      await fs.promises.writeFile(this.path, JSON.stringify(carts), "utf-8");
    } catch (error) {
      throw new Error("Not found");
    }
  }
}
