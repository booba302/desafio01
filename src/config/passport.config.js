import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import UserManager from "../dao/mongo/userManager.js";

const User = new UserManager();
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const InitPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const userExists = await User.getUserByEmail(email);

          if (userExists) return done(null, false);

          const { name, lastname, age } = req.body;

          const newUser = {
            name,
            lastname,
            email,
            password,
            age,
            role: email == "adminCoder@coder.com" ? "admin" : "user",
          };

          const user = await User.createUser(newUser);

          return done(null, user);
        } catch (error) {
          return done("Error al obtener usuario" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const user = await User.valUser(email, password);
          if (!user) return done("Usuario no existe" + error);
          return done(null, user);
        } catch (error) {}
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.2d596fddc5240812",
        clientSecret: "6b5c1aeddd0a826f4f96976eee54f8381d6e8517",
        callbackURL: "http://localhost:8080/api/auth/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const user = await User.getUserByEmail(profile._json.email);
        if (user) return done(null, user);

        const newUser = {
          name: profile._json.name.split(" ")[0],
          lastname: profile._json.name.split(" ")[1],
          email: profile._json.email,
          password: "",
          age: "",
          role:
            profile._json.email == "adminCoder@coder.com" ? "admin" : "user",
        };

        const createUser = await User.createUser(newUser);
        return done(null, createUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser(async (_id, done) => {
    const user = await User.getUserById(_id);
    done(null, user);
  });
};

export default InitPassport;
