"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // Import AccountCircleIcon

function LoginPage() {
  const [tabValue, setTabValue] = useState(0); // 0 for Phone, 1 for Email/Password
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(""); // For email login/access code
  const [username, setUsername] = useState(""); // For credential login
  const [password, setPassword] = useState(""); // For credential login
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0); // 0: Nhập số điện thoại/email, 1: Nhập mã xác minh
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithCredentials, loginAdmin } = useAuth();
  const [userName, setUserName] = useState(""); // Thêm state cho userName

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setStep(0); // Reset step when changing tabs
    setMessage(""); // Clear messages
    setPhoneNumber("");
    setEmail("");
    setUsername("");
    setPassword("");
    setAccessCode("");
  };

  const handleGetAccessCode = async () => {
    setMessage("");
    setIsLoading(true);
    try {
      let response;
      if (tabValue === 0) {
        // Phone login
        response = await api.post("/createAccessCode", { phoneNumber });
      } else {
        // Email access code
        response = await api.post("/loginEmail", { email });
      }
      setMessage(response.data.message);
      setStep(1); // Chuyển sang bước nhập mã xác minh
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to get access code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateAccessCode = async () => {
    setMessage("");
    setIsLoading(true);
    let result;
    if (tabValue === 0) {
      // Phone login
      result = await login(phoneNumber, accessCode, false, userName); // truyền userName
    } else {
      // Email access code
      result = await login(email, accessCode, true);
    }

    if (!result.success) {
      setMessage(result.message);
    }
    setIsLoading(false);
  };

  // Hàm kiểm tra số điện thoại hợp lệ (10 số, bắt đầu bằng 0)
  function isValidPhoneNumber(phone) {
    return /^0[0-9]{9}$/.test(phone);
  }

  const handleCredentialLogin = async () => {
    setMessage("");
    setIsLoading(true);
    // Lấy giá trị ADMIN_USERNAME từ biến môi trường frontend (Vite: import.meta.env)
    const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "";
    if (username === ADMIN_USERNAME) {
      const result = await loginAdmin(username, password);
      if (!result.success) {
        setMessage(result.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      return;
    }
    // Nếu nhập số điện thoại thì phải hợp lệ
    if (/^0/.test(username) && !isValidPhoneNumber(username)) {
      setMessage(
        "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số, bắt đầu bằng 0."
      );
      setIsLoading(false);
      return;
    }
    const result = await loginWithCredentials(username, password);
    if (!result.success) {
      setMessage(result.message);
      setIsLoading(false);
      return;
    }
    localStorage.setItem("userType", result.userType);
    localStorage.setItem("phoneNumber", result.phoneNumber);
    if (result.userType === "admin") {
      window.location.href = "/admin-dashboard";
    } else if (result.userType === "instructor") {
      window.location.href = "/instructor-dashboard";
    } else if (result.userType === "student") {
      window.location.href = "/student-dashboard";
    } else {
      setMessage("Không xác định được loại tài khoản.");
    }
    setIsLoading(false);
  };
  // const handleLogin = async () => {
  //   const result = await loginWithCredentials(email, password);
  //   if (result.success) {
  //     console.log("Đăng nhập thành công");
  //   } else {
  //     console.error(result.message);
  //   }
  // };

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Paper
        elevation={8}
        className="p-8 rounded-xl shadow-2xl w-full max-w-md bg-white text-center"
      >
        <Typography
          variant="h4"
          component="h1"
          className="font-bold text-gray-800 mb-6"
        >
          Classroom Login
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          className="mb-6"
        >
          <Tab label="Login with Phone" />
          <Tab label="Login with Email/Password" />
        </Tabs>

        {tabValue === 0 && ( // Phone Login Tab
          <>
            {step === 0 && (
              <Box className="space-y-6">
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon className="mr-2 text-gray-500" />
                    ),
                  }}
                  className="mb-4"
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleGetAccessCode}
                  disabled={isLoading || !phoneNumber}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </Box>
            )}

            {step === 1 && (
              <Box className="space-y-6">
                <Typography variant="body1" className="text-gray-700 mb-4">
                  A 6-digit code has been sent to{" "}
                  <span className="font-semibold">{phoneNumber}</span>.
                </Typography>
                <TextField
                  label="Tên hiển thị (userName)"
                  variant="outlined"
                  fullWidth
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  type="text"
                  disabled={isLoading}
                  className="mb-4"
                />
                <TextField
                  label="Access Code"
                  variant="outlined"
                  fullWidth
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  type="text"
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <VpnKeyIcon className="mr-2 text-gray-500" />
                    ),
                  }}
                  className="mb-4"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  onClick={handleValidateAccessCode}
                  disabled={isLoading || !accessCode}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify Code"
                  )}
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  onClick={() => setStep(0)}
                  disabled={isLoading}
                  startIcon={<ArrowBackIcon />}
                  className="text-gray-600 hover:text-gray-800 transition duration-300"
                >
                  Back
                </Button>
              </Box>
            )}
          </>
        )}

        {tabValue === 1 && ( // Email/Password Login Tab
          <Box className="space-y-6">
            <TextField
              label="Tên đăng nhập hoặc Số điện thoại"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <AccountCircleIcon className="mr-2 text-gray-500" />
                ),
              }}
              className="mb-4"
              error={
                username !== "" &&
                username.length >= 8 &&
                !isValidPhoneNumber(username) &&
                /^0/.test(username)
              }
              helperText={
                username !== "" &&
                username.length >= 8 &&
                !isValidPhoneNumber(username) &&
                /^0/.test(username)
                  ? "Số điện thoại phải gồm 10 số, bắt đầu bằng 0"
                  : ""
              }
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              disabled={isLoading}
              InputProps={{
                startAdornment: <LockIcon className="mr-2 text-gray-500" />,
              }}
              className="mb-4"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleCredentialLogin}
              disabled={isLoading || !username || !password}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        )}

        {message && (
          <Typography
            color="error"
            align="center"
            className="mt-6 text-red-600 font-medium"
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default LoginPage;
