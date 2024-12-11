import { generateOTP } from "../lib/generateOTP.js";
import generateToken from "../lib/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

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

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("Can't find user.");

    //Remove objectId wrapper from user._id
    const userId = user._id.toString().replace(/^newObjectId\("(.+)"\)$/, "$1");

    //generate OTP
    const otp = await generateOTP(userId);

    // create reusable transporter object using the default SMTP transport\
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ydapo50@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // const mailOptions = {
    //   from: ",
    //   to: ,
    //   subject: "Hello from Nodemailer",
    //   text: "This is a test email sent using Nodemailer.",
    //};
    const mailOptions = {
      from: "ydapo50@gmail.com",
      to: user.email,
      subject: "Your One-Time Password (OTP) Code",
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 100%;
                  padding: 40px;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                  max-width: 600px;
                  margin: 20px auto;
                }
                .header {
                  text-align: center;
                  color: #333333;
                }
                .otp {
                  font-size: 30px;
                  font-weight: bold;
                  color: #3498db;
                  margin: 20px 0;
                  text-align: center;
                }
                .footer {
                  text-align: center;
                  color: #7f8c8d;
                  font-size: 14px;
                }
                .button {
                  display: inline-block;
                  background-color: #3498db;
                  color: #ffffff;
                  padding: 12px 30px;
                  font-size: 16px;
                  text-decoration: none;
                  border-radius: 4px;
                  text-align: center;
                  margin: 20px 0;
                }
                .button:hover {
                  background-color: #2980b9;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>Welcome to Our Platform!</h2>
                </div>
                <p>Hello,</p>
                <p>We received a request to verify your identity. Please use the following One-Time Password (OTP) to proceed:</p>
                <div class="otp">
                  ${otp}
                </div>
                <p>This OTP is valid for the next 5 minutes. If you did not request this, please ignore this email.</p>
                <a href="#" class="button">Verify Now</a>
                <div class="footer">
                  <p>Thank you for using our service.</p>
                  <p>If you have any questions, feel free to contact us.</p>
                </div>
              </div>
            </body>
          </html>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.status(500).json({ message: error.message });
      } else {
        console.log("Email sent: ", info.response);
        res.status(200).json({ message: "OTP sent successfully", OTP: otp });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Login with OTP

export const loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json("Email and OTP required");
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found!");

    const token = await generateToken(user._id);

    res
      .status(200)
      .json({ message: "User logged in successfully with OTP", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
