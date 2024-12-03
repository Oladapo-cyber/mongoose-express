import express, { response } from "express";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getSingleUser,
  updateUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getSingleUser);

router.post("/create", createUser);

router.get("/", getAllUsers);

router.patch("/update/:id", updateUserById);

router.delete("/delete/:id", deleteOneUser);

export default router;
