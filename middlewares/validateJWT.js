import jwt from "jsonwebtoken";

export const validateJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json("Access denied, token missing");
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (!verified)
      return res.status(401).json("Invalid token, authorization denied.");
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
