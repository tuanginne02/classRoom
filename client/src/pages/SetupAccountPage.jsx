"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

function SetupAccountPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  // const [emailDisabled, setEmailDisabled] = useState(false);

  useEffect(() => {
    // Gợi ý email nếu có
    const fetchEmail = async () => {
      try {
        const res = await api.get(`/student/check-setup-token?token=${token}`);
        if (res.data && res.data.email) {
          setEmail(res.data.email);
          // Nếu muốn không cho sửa email, bật dòng dưới:
          // setEmailDisabled(true);
        }
      } catch {
        setMessage("Link không hợp lệ hoặc đã hết hạn.");
        // setEmailDisabled(true);
      }
    };
    if (token) fetchEmail();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!email || !password || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setMessage("Mật khẩu phải từ 6 ký tự trở lên.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/student/setup-account", {
        token,
        email,
        password,
      });
      if (response.data.success) {
        setMessage(response.data.message + " Đang chuyển hướng...");
        setIsSetupComplete(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(response.data.message || "Thiết lập tài khoản thất bại.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi thiết lập tài khoản."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          Thiết lập tài khoản sinh viên
        </Typography>

        {isSetupComplete ? (
          <Alert severity="success" className="mb-4">
            {message}
          </Alert>
        ) : (
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <Typography variant="body1" className="text-gray-700 mb-2">
              Vui lòng nhập email và mật khẩu để hoàn tất đăng ký tài khoản.
            </Typography>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="off"
              // disabled={isLoading || emailDisabled}
              InputProps={{
                startAdornment: <EmailIcon className="mr-2 text-gray-500" />,
              }}
            />
            <TextField
              label="Mật khẩu mới"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              InputProps={{
                startAdornment: <LockIcon className="mr-2 text-gray-500" />,
              }}
            />
            <TextField
              label="Xác nhận mật khẩu"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              InputProps={{
                startAdornment: <LockIcon className="mr-2 text-gray-500" />,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Tạo tài khoản"
              )}
            </Button>
          </form>
        )}

        {message && !isSetupComplete && (
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

export default SetupAccountPage;
