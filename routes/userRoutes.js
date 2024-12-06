import express, { response } from "express";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getSingleUser,
  loginUser,
  updateUserById,
} from "../controllers/userController.js";
import { validateUser } from "../middlewares/validateUser.js";
import { loginLimiter } from "../middlewares/loginLimiter.js";

const router = express.Router();

router.get("/:id", getSingleUser);

router.post("/login", loginLimiter, loginUser);

router.post("/create", createUser);

router.get("/", validateUser, getAllUsers);

router.patch("/update/:id", updateUserById);

router.delete("/delete/:id", deleteOneUser);

export default router;
