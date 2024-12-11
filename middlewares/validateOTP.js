import User from "../models/userModel";

const validateOTP = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    if (!email || !otp) return res.status(400).json("Email and OTP required");
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json("User not found.");

    //Remove objectIdW wrapper fron user._id\
    const userId = user._id
      .toString()
      .replace(/^new ObjectId\("(.+)"\)$/, "$1");

    // Create a new TOTP object.
    let totp = new OTPAuth.TOTP({
      issuer: "ACME",
      label: "Alice",
      algorithm: "SHA1",
      digits: 6,
      period: 300,
      secret: OTPAuth.Secret.fromHex(userId), // Use the user's ID as the secret)
    });

    //Verify a token
    let isValid = totp.validate({
      token: otp,
      window: 1,
    });

    //If the OTP is invalid, return an error message
    if (!isValid) return res.status(400).json("Invalid OTP");

    next(); //If the otp is valid, call the next middleware.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default validateOTP;
