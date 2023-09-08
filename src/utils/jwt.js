import jwt from "jsonwebtoken";

export const SECRET = "palabrasecretajwt";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, SECRET, { expiresIn: "1h" });
  return token;
};

export const JWTMW = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(403).send({ msg: "Not authenticated" });

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user.user;
    next();
  } catch (error) {
    return res.status(403).send({ msg: "Not authenticated" });
  }
};

export const JWTCookieMW = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.send({ error: true });
  try {
    const valid = jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.send({ error: true });
  }
};
