import { Router } from "express";
import passport from "passport";
import UserManager from "../dao/mongo/userManager.js";
import { isLogged, protectView } from "../utils/secure.middleware.js";
import { generateToken } from "../utils/jwt.js";

const userMng = new UserManager();
const userRouter = Router();

userRouter.post("/login", isLogged, async (req, res) => {
  req.session.user = {
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email,
    role: req.user.role,
  };
  res.redirect("/products");
});

userRouter.post("/token", async (req, res) => {
  const user = await userMng.valUser(req.body.email, req.body.password);
  if (!user) return res.send({ error: true });

  const token = generateToken({
    sub: user._id,
    user: { email: user.email },
  });

  res.cookie("accessToken", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.send({ error: false, accessToken: token });
});

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
