import { Router } from "express";
import passport from "passport";
import { isLogged, protectView } from "../utils/secure.middleware.js";

const userRouter = Router();

userRouter.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/products",
    failureRedirect: "login",
  }),
  async (req, res) => {}
);

userRouter.get("/register", isLogged, async (req, res) => {
  res.render("register");
});

userRouter.post(
  "/register",
  passport.authenticate("register", {
    successRedirect: "/products",
    failureRedirect: "/register",
  }),
  async (req, res) => {}
);

userRouter.get("/logout", protectView, async (req, res) => {
  req.session.destroy((er) => {
    res.send("Se ha cerrado la sesión correctamente");
  });
});

userRouter.get("/current", async (req, res) => {
  const user = req.user;
  if (!user) return res.send("No existe usuario loggeado");
  res.send({ user: user });
});

export default userRouter;
