import express from "express";
import { Server as HTTPServer } from "http";
import { Server as SocketIO } from "socket.io";
import handlebars from "express-handlebars";
import mongoose from "mongoose";

import productRouter from "./routes/products.js";
import cartRouter from "./routes/carts.js";
import ProductManager from "./dao/mongo/productManager.js";
import MessageManager from "./dao/mongo/messageManager.js";
import __dirname from "./config/dirname.js";
import viewsRouter from "./routes/views.js";

const app = express();
const productMng = new ProductManager();
const messageMng = new MessageManager();

const conn = await mongoose.connect(
  "mongodb+srv://booba302:CEtg68FE9czaHCp@codercluster.ex9gekc.mongodb.net/ecommerce"
);

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

  const messages = await messageMng.getMessage();
  socket.emit("allMessages", messages)

  socket.on("addProdc", async (product) => {
    try {
      await productMng.addProduct(product);
      const products = await productMng.getProducts();
      socket.emit("sendProdc", products);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("delProdc", async (id) => {
    try {
      await productMng.deleteProduct(id);
      const products = await productMng.getProducts();
      socket.emit("sendProdc", products);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("sendMsg", async (data) => {
     let user = data.user
     let message = data.message
     await messageMng.addMessage(user, message)
     const messages = await messageMng.getMessage();
     socket.broadcast.emit("getMsg", messages)
  })
});

app.post("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
  req.io.emit("sendProdc");
});

app.get("/chat", (req,res)=>{
  res.render("chat")
})

httpServer.listen(8080, () => {
  console.log("Escuchando puerto: 8080");
});
