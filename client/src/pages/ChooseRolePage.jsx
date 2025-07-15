import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const ChooseRolePage = () => {
  const navigate = useNavigate();
  const phoneNumber = localStorage.getItem("phoneNumber");
  const { setUserType, setIsAuthenticated } = useAuth();

  const handleChoose = async (role) => {
    if (role === "student") {
      await api.post("/setRole", { phoneNumber, role });
      localStorage.setItem("userType", "student");
      setUserType("student");
      setIsAuthenticated(true);
      navigate("/student-dashboard");
    } else if (role === "instructor") {
      navigate("/instructor-info");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Bạn là?</h2>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded mb-4"
        onClick={() => handleChoose("student")}
      >
        Sinh viên
      </button>
      <button
        className="bg-green-500 text-white px-6 py-2 rounded"
        onClick={() => handleChoose("instructor")}
      >
        Giáo viên
      </button>
    </div>
  );
};

export default ChooseRolePage;
