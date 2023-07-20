import express from "express";
import { Server as HTTPServer } from "http";
import { Server as SocketIO } from "socket.io";
import handlebars from "express-handlebars";

import productRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";
import ProductManager from "./productManager.js";
import __dirname from "./config/dirname.js";
import viewsRouter from "./routes/views.js";

const app = express();
const productMng = new ProductManager();
const products = await productMng.getProducts();

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const httpServer = HTTPServer(app);
const io = new SocketIO(httpServer);

app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/", viewsRouter);

app.use(express.static(`${__dirname}/../public`));
app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log(`socket conectado: ${socket.id}`);
  socket.emit("products", products);
});

httpServer.listen(8080, () => {
  console.log("Escuchando puerto: 8080");
});
