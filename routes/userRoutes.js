import express, { response } from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Holla");
});

router.post("/create", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).send("Username is required!");
    }
    const existingUser = await User.findOne({ username });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }
    const user = new User(req.body);
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
