import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = async (userId) => {
  return await jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: 30,
  });
};

export default generateToken;
