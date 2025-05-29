const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  resetPasswordController,
} = require("../controllers/authController");
const {
  sendOtp,
  verifyOtp,
  sendEmailOtp,
  verifyEmailOtp,
} = require("../controllers/otpController");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/reset-password", resetPasswordController);

// OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);

module.exports = router;
