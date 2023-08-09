import express from "express";
import { Server as HTTPServer } from "http";
import { Server as SocketIO } from "socket.io";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import productRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";
import ProductManager from "./dao/fs/productManager.js";
import __dirname from "./config/dirname.js";
import viewsRouter from "./routes/views.js";

const app = express();
const productMng = new ProductManager();

const httpServer = HTTPServer(app);
const io = new SocketIO(httpServer);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(`${__dirname}/../public`));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
  req.io.emit("sendProdc");
});

io.on("connection", async (socket) => {
  console.log(`socket conectado: ${socket.id}`);
  const products = await productMng.getProducts();
  socket.emit("sendProdc", products);

  socket.on("addProdc", async (product) => {
    try {
      await productMng.addProduct(product);
      socket.emit("sendProducts", products);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("delProdc", async (id) => {
    try {
      await productMng.deleteProduct(id);
      socket.emit("sendProducts", products);
    } catch (error) {
      console.log(error);
    }
  });
});

app.post("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
  req.io.emit("sendProdc");
});

httpServer.listen(8080, () => {
  console.log("Escuchando puerto: 8080");
});
