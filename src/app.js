import express from "express";
import ProductManager from "./productManager.js";

const productMng = new ProductManager();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productMng.getProducts();
    res.send(limit ? products.slice(0, limit) : products);
  } catch (error) {
    res.status(404).send({ error: true });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productMng.getProductById(id);
    res.send(product);
  } catch (error) {
    if (error.message === "Not found") {
      res.status(404).send({
        error: true,
        msg: "No se encuentra el producto con el id proporcionado",
      });
    } else {
      res.status(500);
    }
  }
});

app.listen(8080, () => {
  console.log("Escuchando puerto: 8080");
});
