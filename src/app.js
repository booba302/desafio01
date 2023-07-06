import express from "express";
import ProductManager from "./productManager.js";

const productMng = new ProductManager();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await productMng.getProducts();
  res.send(limit ? products.slice(0, limit) : products);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productMng.getProductById(id);
  res.send(product);
});

app.listen(8080, () => {
  console.log("Escuchando puerto: 8080");
});
