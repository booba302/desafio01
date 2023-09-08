import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const authManager = Router();

authManager.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

authManager.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/products",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

export default authManager;
