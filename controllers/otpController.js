const otpStore = new Map(); // In-memory store for OTPs (use Redis or DB for production)
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const axios = require("axios");
const TWOFACTOR_API_KEY = "998431b2-3bdb-11f0-a562-0200cd936042";

const emailOtpStore = new Map(); // In-memory store for email OTPs

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/v1/auth/send-otp
const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });
  const otp = generateOTP();
  otpStore.set(phone, otp);

  try {
    // 2Factor API: Send OTP
    const url = `https://2factor.in/API/V1/${TWOFACTOR_API_KEY}/SMS/${phone}/${otp}/OTP`;
    await axios.get(url);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("2Factor error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to send OTP SMS" });
  }
};

// POST /api/v1/auth/verify-otp
const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });
  const valid = otpStore.get(phone) === otp;
  if (valid) {
    otpStore.delete(phone);
    return res.status(200).json({ success: true });
  }
  res.status(400).json({ error: "Invalid OTP" });
};

// POST /api/v1/auth/send-email-otp
const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const otp = generateOTP();
  emailOtpStore.set(email, otp);

  // Configure nodemailer (use real SMTP in production)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Nodemailer error:", err);
    res.status(500).json({ error: "Failed to send OTP email" });
  }
};

// POST /api/v1/auth/verify-email-otp
const verifyEmailOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });
  const valid = emailOtpStore.get(email) === otp;
  if (valid) {
    emailOtpStore.delete(email);
    return res.status(200).json({ success: true });
  }
  res.status(400).json({ error: "Invalid OTP" });
};

module.exports = {
  sendOtp,
  verifyOtp,
  sendEmailOtp,
  verifyEmailOtp,
  otpStore,
  emailOtpStore,
};