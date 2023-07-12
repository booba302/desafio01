import fs from "fs";
import __dirname from "./config/dirname.js";
import ProductManager from "./productManager.js";
const productMng = new ProductManager();

export default class CartManager {
  constructor() {
    this.cart = [];
    this.path = `${__dirname}/db/cart.json`;
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
    console.log(carts);
    try {
      const cart = {
        id: carts.length == 0 ? 1 : carts.length + 1,
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
      console.log("No se encuentra el producto");
      throw new Error("Cart Not found");
    } else {
      return findCart;
    }
  }

  async addProductToCart(idCart, idProd) {
    try {
      const carts = await this.getCarts();
      const findCart = await this.getCartById(idCart);
      const findPrdt = await productMng.getProductById(idProd);

      const findProductInCart = findCart.products.find(
        (prdt) => prdt.id == idProd
      );

      if (!findProductInCart) {
        const newCart = carts.filter((cart) => cart.id != idCart);
        const newProduct = {
          id: findPrdt.id,
          quantity: 1,
        };
        findCart.products.push(newProduct);
        newCart.push(findCart);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newCart),
          "utf-8"
        );
        return findCart;
      }
      findCart.products.map((product) => {
        if (product.id == idProd) {
          product.quantity++;
        }
      });
      const newCart = carts.filter((cart) => cart.id != idCart);
      newCart.push(findCart);
      await fs.promises.writeFile(this.path, JSON.stringify(newCart), "utf-8");
      return findCart;
    } catch (error) {
      throw new Error("Not found");
    }
  }
}
