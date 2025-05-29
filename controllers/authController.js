const userModel = require("../models/userModels");
const errorResponse = require("../utils/errorResponse");

// SEND TOKEN
const sendToken = (user, statusCode, res) => {
  const accessToken = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    accessToken,
  });
};

// REGISTER
exports.registerController = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !password || !email) {
      return next(new errorResponse("Username, password, and email are required", 400));
    }

    // Normalize email
    if (email) email = email.toLowerCase();

    // Check if user already exists
    if (email) {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return next(new errorResponse("Email is already registered", 400));
      }
    }

    // Create user and send token
    try {
      const user = await userModel.create({ username, email, password });
      console.log("User created:", user);  // 👈 Logs to confirm success
      sendToken(user, 201, res);
    } catch (err) {
      console.error("Error during user creation:", err);  // 👈 Logs on error
      return next(new errorResponse("Registration failed", 500));
    }

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    next(error);
  }
};


// LOGIN
exports.loginController = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(new errorResponse("Please provide email and password", 400));
    }

    // Normalize email to lowercase if present
    if (email) email = email.toLowerCase();

    // Find user by email
    const user = await userModel.findOne({ email });

    if (!user) {
      console.log("Login failed: User not found", { email });
      return next(new errorResponse("Invalid credentials", 401));
    }

    // Check password using the model's method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log("Login failed: Password mismatch for user", user.email);
      return next(new errorResponse("Invalid credentials", 401));
    }

    console.log("Login success for user", user.email);
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// LOGOUT
exports.logoutController = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
};


// ...existing code...

exports.resetPasswordController = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // OTP verification logic (reuse your existing OTP/email OTP logic)
    let isValid = false;
    if (email && otp) {
      // Check OTP for email
      const { emailOtpStore } = require("./otpController");
      isValid = emailOtpStore.get(email) === otp;
      if (isValid) emailOtpStore.delete(email);
    }

    if (!isValid) {
      return next(new errorResponse("Invalid OTP", 400));
    }

    // Find user and update password
    const user = await userModel.findOne({ email });

    if (!user) {
      return next(new errorResponse("User not found", 404));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
