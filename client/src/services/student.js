import api from "./api";

export const fetchStudent = async () => {
    const res = await api.get("/student");
    return res.data;
};

export const addStudent = async (data) => {
    const res = await api.post("/addStudent", data);
    return res.data;
};

export const editStudent = async (phone, data) => {
    const res = await api.put(`/editStudent/${phone}`, data);
    return res.data;
};

export const deleteStudent = async (phone) => {
    const res = await api.delete(`/student/${phone}`);
    return res.data;
};

export const toggleStudentStatus = async (phone) => {
    const res = await api.put(`/toggleStudentStatus/${phone}`);
    return res.data;
};

export const toggleStudentClassCreation = async (phone) => {
    const res = await api.put(`/toggleStudentClassCreation/${phone}`);
    return res.data;
};

export const getStudentClassroomId = async (phone) => {
    const res = await api.get(`/student/${phone}`);
    // classroomId có thể là 1 chuỗi hoặc mảng (classroomIds), ưu tiên classroomId nếu có, nếu không lấy classroomIds[0]
    if (res.data.classroomId) return res.data.classroomId;
    if (Array.isArray(res.data.classroomIds) && res.data.classroomIds.length > 0) return res.data.classroomIds[0];
    return null;
};