import { Router } from "express";
import CartManager from "../dao/mongo/cartManager.js";

const cartMng = new CartManager();
const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  const cart = await cartMng.getCarts();
  res.send(cart);
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartMng.addCart();
    res.send({
      sucess: true,
      msg: "El carrito fue creado satisfactoriamente",
      cart: cart,
    });
  } catch (error) {
    res.status(404).send({ msg: "No se pudo crear el carrito" });
  }
});

cartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await cartMng.getCartById(id);
    res.send(cart);
  } catch (error) {
    error.message === "Cart Not found"
      ? res.status(404).send({ msg: "El ID del carrito es inválido" })
      : res.status(500);
  }
});

cartRouter.post("/:idCart/product/:idProd", async (req, res) => {
  const { idCart, idProd } = req.params;
  try {
    const addToCart = await cartMng.addProductToCart(idCart, idProd);
    res.send({
      sucess: true,
      msg: "El producto fue agregado satisfactoriamente",
      cart: addToCart,
    });
  } catch (error) {
    error.message === "Not found"
      ? res.status(404).send({ msg: "ID del producto y/o carrito inválido" })
      : res.status(500);
  }
});

cartRouter.delete("/:idCart/product/:idProd", async (req, res) => {
  const { idCart, idProd } = req.params;
  try {
    const deleteProd = await cartMng.delProductInCart(idCart, idProd);
    res.send(deleteProd);
  } catch (error) {
    console.log(error);
  }
});

export default cartRouter;
