import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import {
  Box,
  Typography,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Collapse,
} from "@mui/material";

const Register = () => {
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    try {
      await axios.post("/api/v1/auth/send-email-otp", { email });
      toast.success("OTP sent to your email");
      setShowOtp(true);
    } catch (err) {
      setError("Failed to send OTP");
      setTimeout(() => setError(""), 5000);
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/verify-email-otp`, { email, otp });
      // If OTP is valid, now create the user
      await axios.post("/api/v1/auth/register", {
        username,
        email,
        password,
      });
      toast.success("Registration complete. Please login.");
      setOtpVerified(true);
      navigate("/login");
    } catch (err) {
      setError("Invalid OTP or registration failed");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <Box
      width={isNotMobile ? "40%" : "80%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ boxShadow: 5, animation: "glow 6s ease-in-out infinite" }}
      style={{ background: "#0f172a", color: "white" }}
    >
      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>

      <form onSubmit={e => e.preventDefault()}>
        <TextField
          label="Username"
          type="text"
          required
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 1, mb: 2, color: "#2563eb", borderColor: "#2563eb" }}
          onClick={handleSendOtp}
          disabled={!email}
        >
          Send OTP
        </Button>
        {showOtp && (
          <>
            <TextField
              label="Enter OTP"
              type="text"
              required
              fullWidth
              margin="normal"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 1, bgcolor: "#2563eb", color: "white" }}
              onClick={handleVerifyOtpAndRegister}
              disabled={otpVerified}
            >
              Verify OTP & Register
            </Button>
          </>
        )}

        <Typography mt={2}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#22c55e", textDecoration: "none" }}>
            Login
          </Link>
        </Typography>
      </form>

      {/* Disclaimer */}
      <Typography mt={4} align="center" color="gray" fontSize="0.85rem">
        Enter your details carefully. We'll never share your information.
      </Typography>
    </Box>
  );
};

export default Register;


