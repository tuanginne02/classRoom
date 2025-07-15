"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadAuthFromLocalStorage = useCallback(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    const storedUserType = localStorage.getItem("userType");
    if (storedPhoneNumber && storedUserType) {
      setIsAuthenticated(true);
      setPhoneNumber(storedPhoneNumber);
      setUserType(storedUserType);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAuthFromLocalStorage();
  }, [loadAuthFromLocalStorage]);

  /* ---------- YÊU CẦU MÃ OTP ---------- */

  /* Gửi mã qua SMS */
  const requestSmsCode = async (phoneNumber) => {
    try {
      await api.post("/createAccessCodeSms", { phoneNumber });
      return { success: true };
    } catch (err) {
      console.error("Send SMS code error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send SMS code.",
      };
    }
  };

  /* Gửi mã qua Email */
  const requestEmailCode = async (email) => {
    try {
      await api.post("/createAccessCodeEmail", { email });
      return { success: true };
    } catch (err) {
      console.error("Send email code error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send email code.",
      };
    }
  };

  const login = async (
    phoneOrEmail,
    accessCode,
    isEmailLogin = false,
    userName = ""
  ) => {
    setIsLoading(true);
    try {
      let response;
      if (isEmailLogin) {
        response = await api.post("/validateAccessCodeEmail", {
          email: phoneOrEmail,
          accessCode,
        });
      } else {
        response = await api.post("/validateAccessCode", {
          phoneNumber: phoneOrEmail,
          accessCode,
          userName, // truyền userName lên backend
        });
      }

      if (response.data.success) {
        const { userType } = response.data;
        setIsAuthenticated(true);
        setUserType(userType);
        setPhoneNumber(phoneOrEmail); // Store phone/email as identifier
        localStorage.setItem("phoneNumber", phoneOrEmail);
        localStorage.setItem("userType", userType);

        if (!userType) {
          navigate("/choose-role");
        } else if (userType === "instructor") {
          navigate("/instructor-dashboard");
        } else if (userType === "student") {
          navigate("/student-dashboard");
        }
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed.",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "An error occurred during login.",
      };
    } finally {
      setIsLoading(false);
    }
  };
  const loginWithCredentials = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/login-credentials", {
        username: username.trim(),
        password,
      });
      if (response.data.success) {
        const { userType, phoneNumber } = response.data;
        setIsAuthenticated(true);
        setUserType(userType);
        setPhoneNumber(phoneNumber);

        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("userType", userType);

        // Nếu là instructor, lấy classroomId và lưu vào localStorage
        if (userType === "instructor") {
          const profileRes = await api.get(`/instructor/${phoneNumber}`);
          const instructor = profileRes.data;
          console.log("Profile instructor:", instructor); // <-- Thêm log này
          if (instructor.classroomId) {
            localStorage.setItem("classroomId", instructor.classroomId);
            console.log("Đã lưu classroomId:", instructor.classroomId); // <-- Thêm log này
          }
          // window.location.reload(); // reload lại trang để các component lấy classroomId mới nhất
        }

        return { success: true, userType, phoneNumber };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed.",
        };
      }
    } catch (error) {
      console.error("Credential login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "An error occurred during login.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/admin-login", { username, password });
      if (response.data.success) {
        setIsAuthenticated(true);
        setUserType("admin");
        setPhoneNumber(username);
        localStorage.setItem("phoneNumber", username);
        localStorage.setItem("userType", "admin");
        navigate("/admin-dashboard");
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed.",
        };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred during admin login.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- ĐĂNG XUẤT ---------- */
  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setPhoneNumber(null);
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const value = {
    isAuthenticated,
    userType,
    phoneNumber,
    isLoading,
    login,
    requestSmsCode,
    requestEmailCode,
    loginWithCredentials,
    logout,
    loadAuthFromLocalStorage,
    loginAdmin,
    setUserType, // export thêm
    setIsAuthenticated, // export thêm
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
