export const protectView = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  next();
};
export const isLogged = (req, res, next) => {
  if (req.user) return res.redirect("/products");
  next();
};
