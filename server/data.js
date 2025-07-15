import db from "./firebase.js";

// Lấy danh sách users từ Firebase
export async function getUsers() {
  const snapshot = await db.ref("users").once("value");
  return snapshot.val() || [];
}

// Lấy danh sách students từ Firebase
export async function getStudents() {
  const snapshot = await db.ref("students").once("value");
  return snapshot.val() || {};
}

// Lấy accessCodes từ Firebase (nếu có lưu trên Firebase)
export async function getAccessCodes() {
  const snapshot = await db.ref("accessCodes").once("value");
  return snapshot.val() || {};
}

// Lấy chatMessages từ Firebase (nếu có lưu trên Firebase)
export async function getChatMessages() {
  const snapshot = await db.ref("chatMessages").once("value");
  return snapshot.val() || [];
}

// Lấy activities từ Firebase (nếu có lưu trên Firebase)
export async function getActivities() {
  const snapshot = await db.ref("activities").once("value");
  return snapshot.val() || [];
}
export async function getToken() {
  const snapshot = await db.ref("Token").once("value");
  return snapshot.val() || [];
}
