import mongoose from "mongoose";
import CartModel from "../models/cart.schema.js";

export default class CartManager {
  constructor() {
    this.path = path;
  }

  async getCarts() {
    try {
      const carts = await CartModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  }

  async addCart() {
    try {
      await CartModel.create({ products: [] });
      return { status: 200, response: "Cart created." };
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const findCart = CartModel.findById(id);
      if (!findCart) {
        console.log("No se encuentra el carrito");
        throw new Error("Cart Not found");
      } else {
        return findCart;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(idCart, idProd) {
    try {
      const findCart = CartModel.findById(idCart);
      const findPrdt = CartModel.findById(idProd);
      if (!findCart || !findPrdt) throw new Error("Not found");

      const findProductsInCart = findCart.products.find(
        (prod) => (prod.id = idProd)
      );
      if (!findProductsInCart) {
        findCart.products.push({ product: idProd, quantity: 1 });
      } else findProductsInCart.quantity++;

      await findCart.save();
      console.log(`se agrego ${idProd} al carrito ${idCart}`);
      return findCart;
    } catch (error) {
      console.log(error);
    }
  }
}
