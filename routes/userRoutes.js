import express, { response } from "express";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getSingleUser,
  loginUser,
  loginWithOTP,
  sendOTP,
  updateUserById,
} from "../controllers/userController.js";
import { validateUser } from "../middlewares/validateUser.js";
import { loginLimiter } from "../middlewares/loginLimiter.js";
import { validateJWT } from "../middlewares/validateJWT.js";
import { generateOTP } from "../lib/generateOTP.js";
import validateOTP from "../middlewares/validateOTP.js";

const router = express.Router();

router.post("/login", loginLimiter, loginUser);

router.post("/create", createUser);

// router.get("/", validateUser, getAllUsers);

router.get("/", validateJWT, getAllUsers);

router.get("/:id", validateJWT, getSingleUser);

router.patch("/update/:id", validateJWT, updateUserById);

router.delete("/delete/:id", validateJWT, deleteOneUser); //Delete userby id

router.post("/send-otp", sendOTP); //Send otp to the user

router.post("/otp-login", validateOTP, loginWithOTP);
export default router;
