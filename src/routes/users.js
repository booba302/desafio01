import { Router } from "express";
import passport from "passport";
import UserManager from "../dao/mongo/userManager.js";
import { isLogged, protectView } from "../utils/secure.middleware.js";

const userMng = new UserManager();
const userRouter = Router();

userRouter.get("/login", isLogged, async (req, res) => {
  res.render("/login");
});

userRouter.post(
  "/login",
  isLogged,
  passport.authenticate("login"),
  async (req, res) => {
    req.session.user = {
      name: req.user.name,
      lastname: req.user.lastname,
      email: req.user.email,
      role: req.user.role,
    };
    res.redirect("/products");
  }
);

userRouter.get("/register", isLogged, async (req, res) => {
  res.render("register");
});

userRouter.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    res.redirect("/login");
  }
);

userRouter.get("/logout", protectView, async (req, res) => {
  req.session.destroy((er) => {
    res.send("Se ha cerrado la sesión correctamente");
  });
});



export default userRouter;
