import { Router } from "express";
import UserManager from "../dao/mongo/userManager.js";
import { isLogged, protectView } from "../utils/secure.middleware.js";

const userMng = new UserManager();
const userRouter = Router();

userRouter.get("/", isLogged, async (req, res) => {
  res.redirect("/login");
});

userRouter.post("/login", isLogged, async (req, res) => {
  const { email, password } = req.body;

  const user = await userMng.valUser(email, password);
  if (!user) return res.redirect("/login");

  delete user.password;
  delete user.salt;

  req.session.user = user;
  res.redirect("/products");
});

userRouter.get("/logout", protectView, async (req, res) => {
  req.session.destroy((er) => {
    res.send("Se ha cerrado la sesión correctamente");
  });
});

userRouter.get("/register", isLogged, async (req, res) => {
  res.render("register");
});

userRouter.post("/register", isLogged, async (req, res) => {
  const { name, lastname, email, password } = req.body;

  const user = {
    name,
    lastname,
    email,
    password,
    role: email == "adminCoder@coder.com" ? "admin" : "user",
  };
  const newUser = await userMng.createUser(user);
  res.redirect("/login")
});

export default userRouter;
