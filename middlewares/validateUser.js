export const validateUser = (req, res, next) => {
  const userPassword = req.headers["password"];
  const validPassword = "password123";
  if (userPassword === validPassword) {
    next();
  } else {
    res.status(400).json("Invalid password, unauthorised access.");
  }
};
