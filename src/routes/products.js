import { Router } from "express";
import ProductManager from "../productManager.js";

const productMng = new ProductManager();
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productMng.getProducts();
    res.send(limit ? products.slice(0, limit) : products);
  } catch (error) {
    res.status(404).send({ error: true });
  }
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productMng.getProductById(id);
    res.send(product);
  } catch (error) {
    error.message === "Product Not found"
      ? res.status(404).send({ msg: "El ID del producto es inválido" })
      : res.status(500);
  }
});

productRouter.post("/", async (req, res) => {
  const body = req.body;
  try {
    const newProduct = await productMng.addProduct(body);
    res.send({
      sucess: true,
      msg: "El siguiente producto fue creado satisfactoriamente",
      product: newProduct,
    });
  } catch (error) {    
    error.message === "Missing data"
      ? res.status(404).send({ msg: "Datos faltantes" })
      : res.status(500);
    error.message === "Already exist"
      ? res.status(404).send({ msg: "Ya existe un producto con ese código" })
      : res.status(500);
  }
});

productRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const updProduct = await productMng.updateProduct(id, body);
    res.send({
      sucess: true,
      msg: "El siguiente producto fue actualizado satisfactoriamente",
      product: updProduct,
    });
  } catch (error) {
    error.message === "Not found"
      ? res.status(404).send({ msg: "El ID es inválido" })
      : res.status(500);
  }
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const delProduct = await productMng.deleteProduct(id);
    res.send({
      sucess: true,
      msg: "El siguiente producto fue eliminado satisfactoriamente",
      product: delProduct,
    });
  } catch (error) {
    error.message === "Not found"
      ? res.status(404).send({ msg: "El ID es inválido" })
      : res.status(500);
  }
});

export default productRouter;
