import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const InstructorInfoPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subjects: "",
    experience: "",
    education: "",
  });
  const phoneNumber = localStorage.getItem("phoneNumber");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Vui lòng nhập tên và email.");
      return;
    }
    try {
      await api.post("/setRole", {
        phoneNumber,
        role: "instructor",
        info: {
          ...form,
          subjects: form.subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      localStorage.setItem("userType", "instructor");
      navigate("/instructor-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Thông tin giáo viên</h2>
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <input
          className="w-full mb-3 p-2 border rounded"
          name="name"
          placeholder="Họ tên"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          name="subjects"
          placeholder="Môn dạy (cách nhau dấu phẩy)"
          value={form.subjects}
          onChange={handleChange}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          name="experience"
          placeholder="Kinh nghiệm"
          value={form.experience}
          onChange={handleChange}
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          name="education"
          placeholder="Bằng cấp"
          value={form.education}
          onChange={handleChange}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded w-full"
          type="submit"
        >
          Lưu và tiếp tục
        </button>
      </form>
    </div>
  );
};

export default InstructorInfoPage;
