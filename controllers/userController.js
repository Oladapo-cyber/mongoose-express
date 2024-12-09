import generateToken from "../lib/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).send("Username is required!");
    }
    const existingUser = await User.findOne({ username });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).send("User already exists!");
    }

    const user = new User(req.body);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json("Invalid password");

    const token = await generateToken(user._id);

    res
      .status(200)
      .json({ message: "User logged in successfully", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: false });
    if (!users) return res.status(404).json("No users found");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, { password: false });

    if (!user) return res.status(404).json("User not found");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json("User id is required");

    const data = req.body;
    //When I used this, it made no change to the data beause I was supposed to use req.body instead of req.params
    //const data = req.params;

    if (!data) return res.status(404).json("Request body is required.");

    const user = await User.findByIdAndUpdate(id, data);
    if (!user) return res.status(404).json("user not found");
    const insertedUser = await user.save(); // save the user info into the database
    res
      .status(200)
      .json({ message: "User updated successfully", data: insertedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json("User id is required.");

    const data = req.body;
    if (!data) return res.status(404).json("User not found.");

    const user = await User.findByIdAndDelete(id, data);
    if (!user) return res.status(404).json("User not found");
    const deletedUser = await user.save();

    res.status(200).json("user successfully deleted", { data: deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
