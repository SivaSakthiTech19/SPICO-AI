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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");

  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Forgot password states
  const [forgotOpen, setForgotOpen] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpStep, setFpStep] = useState(1); // 1: send OTP, 2: verify OTP & reset

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password };

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, payload);
      toast.success("Login Successfully");
      localStorage.setItem("authToken", data.accessToken);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
      setTimeout(() => setError(""), 7000);
    }
  };

  // Forgot password: Send OTP
  const handleSendOtp = async () => {
    try {
      await axios.post("/api/v1/auth/send-email-otp", { email: fpEmail });
      toast.success("OTP sent!");
      setFpStep(2);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to send OTP"
      );
    }
  };

  // Forgot password: Reset
  const handleResetPassword = async () => {
    try {
      const payload = { email: fpEmail, otp: fpOtp, newPassword: fpNewPassword };

      await axios.post("/api/v1/auth/reset-password", payload);
      toast.success("Password reset successful!");
      setForgotOpen(false);
      setFpStep(1);
      setFpEmail("");
      setFpOtp("");
      setFpNewPassword("");
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to reset password"
      );
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

      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>

        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "white" } }}
          InputProps={{
            style: { color: "white" },
          }}
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
          InputProps={{
            style: { color: "white" },
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 2, bgcolor: "#2563eb", color: "white", "&:hover": { bgcolor: "#1d4ed8" } }}
        >
          Login
        </Button>

        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#22c55e", textDecoration: "none" }}>
              Please Register
            </Link>
          </Typography>
          <Button
            variant="text"
            sx={{ color: "#22c55e" }}
            onClick={() => setForgotOpen(true)}
          >
            Forgot Password?
          </Button>
        </Box>
      </form>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          {fpStep === 1 ? (
            <>
              <TextField
                label="Email"
                type="email"
                required
                fullWidth
                margin="normal"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="OTP"
                required
                fullWidth
                margin="normal"
                value={fpOtp}
                onChange={(e) => setFpOtp(e.target.value)}
              />
              <TextField
                label="New Password"
                type="password"
                required
                fullWidth
                margin="normal"
                value={fpNewPassword}
                onChange={(e) => setFpNewPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setForgotOpen(false);
            setFpStep(1);
            setFpEmail("");
            setFpOtp("");
            setFpOtp("");
            setFpNewPassword("");
          }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Disclaimer */}
      <Typography mt={4} align="center" color="gray" fontSize="0.85rem">
        This tool can make mistake check twice
      </Typography>
    </Box>
  );
};

export default Login;
