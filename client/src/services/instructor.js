import api from "./api";

export const fetchInstructors = async () => {
  const res = await api.get("/instructors");
  return res.data;
};

export const addInstructor = async (data) => {
  const res = await api.post("/addInstructor", data);
  return res.data;
};

export const editInstructor = async (phone, data) => {
  const res = await api.put(`/editInstructor/${phone}`, data);
  return res.data;
};

export const deleteInstructor = async (phone) => {
  const res = await api.delete(`/instructor/${phone}`);
  return res.data;
};

export const toggleInstructorStatus = async (phone) => {
  const res = await api.put(`/toggleInstructorStatus/${phone}`);
  return res.data;
};

export const toggleInstructorClassCreation = async (phone) => {
  const res = await api.put(`/toggleInstructorClassCreation/${phone}`);
  return res.data;
};