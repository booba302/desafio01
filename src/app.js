import express from "express";
import productRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/products", productRouter);
app.use("/carts", cartRouter);

app.listen(8080, () => {
  console.log("Escuchando puerto: 8080");
});
