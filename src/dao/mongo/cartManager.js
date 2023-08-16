import CartModel from "../models/cart.schema.js";
import ProductModel from "../models/products.schema.js";

export default class CartManager {
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
      const newCart = await CartModel.create({ products: [] });
      return newCart;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const findCart = await CartModel.findById(id);
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
      const findCart = await CartModel.findById(idCart);
      const findPrdt = await ProductModel.findById(idProd);
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

  async delProductInCart(idCart, idProd) {
    try {
      let findCart = await CartModel.findById(idCart);
      const prdtIndex = findCart.products.findIndex(
        (prod) => prod.product == idProd
      );
      if (findCart.products[prdtIndex].quantity > 1) {
        findCart.products[prdtIndex].quantity--;
      } else {
        findCart = await CartModel.findOneAndUpdate(
          { _id: idCart },
          { $pull: { products: { product: idProd } } },
          { new: true }
        );
      }
      await findCart.save();
      return findCart;
    } catch (error) {
      console.log(error);
    }
  }
}
