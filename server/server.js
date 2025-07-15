import express from "express"
import http from "http"
import {
  Server
} from "socket.io"
import bodyParser from "body-parser"
import cors from "cors" // Import the cors package
import bcrypt from "bcrypt" // Import bcrypt
import {
  v4 as uuidv4
} from "uuid" // Import uuid for unique tokens
import {
  generateAccessCode,
  sendSms,
  sendEmail
} from "./utils.js"
import {
  getUsers,
  getAccessCodes,
  getStudents,
  getToken,
  getChatMessages,
  getActivities
} from "./data.js"
import multer from "multer"; // Thêm Multer để upload file
import path from "path";
import db from "./firebase.js";
import dotenv from "dotenv";
dotenv.config();

// Cấu hình Multer để lưu file mô tả vào thư mục uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({
  storage
});

// Đảm bảo thư mục uploads tồn tại
import fs from "fs";
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
  },
})

// Use cors middleware BEFORE your routes
app.use(cors()) // This will allow all origins by default for development

app.use(bodyParser.json())

// Map to store connected users: socket.id -> { phoneNumber, userType }
const connectedUsers = {}

// Function to generate a consistent conversation ID
const getConversationId = (phone1, phone2) => {
  // Ensure consistent order for conversation ID
  return [phone1, phone2].sort().join("_")
}

// SỬA: broadcastOnlineStatus lấy từ Firebase
const broadcastOnlineStatus = async () => {
  const snapshot = await db.ref("students").once("value");
  const students = snapshot.val() || {};
  const onlineStudentsList = Object.values(students).map((student) => ({
    phone: student.phone,
    name: student.name,
    isOnline: student.isOnline,
  }));
  io.emit("onlineUsersUpdate", onlineStudentsList);
};

// --- Authentication Routes ---

/**
 * POST /createAccessCode
 * Params: phoneNumberAction: Generate 6-digit code, store in Firebase (in-memory), send via Twilio (mocked)
 */
// SMS 
function isValidPhoneNumber(phone) {
  return /^0[0-9]{9}$/.test(phone);
}
app.post("/createAccessCode", async (req, res) => {
  const {
    phoneNumber
  } = req.body;
  if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
    return res.status(400).json({
      message: "Phone number is invalid."
    });
  }
  const code = generateAccessCode();
  await db.ref(`accessCodes/${phoneNumber}`).set({
    code,
    type: "phone"
  });
  try {
    await sendSms(phoneNumber, `Your access code is: ${code}`);
    res.status(200).json({
      message: "Access code sent successfully."
    });
  } catch (error) {
    console.error("[BACKEND ERROR] Failed to send SMS via Twilio:", error.message);
    res.status(500).json({
      message: "Failed to send access code. Please check the phone number or try again later."
    });
  }
});
// MAil 
app.post("/createAccessCodeEmail", async (req, res) => {
  const {
    email
  } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required."
    });
  }
  const code = generateAccessCode();
  await db.ref(`accessCodes/${email}`).set({
    code,
    type: "email"
  });
  try {
    await sendEmail(
      email,
      "Your Access Code",
      `Your access code is: <b>${code}</b> (valid for 10 minutes)`
    );
    res.status(200).json({
      message: "Access code sent to email."
    });
  } catch (error) {
    console.error("[EMAIL ERROR]", error.message);
    res.status(500).json({
      message: "Failed to send email."
    });
  }
});

/**
 * POST /   
 * Params: phoneNumber, accessCodeAction: Match code in Firebase (in-memory), clear code on success, return user type (instructor or student)
 */
app.post("/validateAccessCode", async (req, res) => {
  const {
    phoneNumber,
    accessCode,
    userName
  } = req.body;
  if (!phoneNumber || !accessCode) {
    return res.status(400).json({
      message: "Phone number and access code are required."
    });
  }
  const snap = await db.ref(`accessCodes/${phoneNumber}`).once("value");
  const storedCodeInfo = snap.val();
  console.log("Validate access code:", {
    phoneNumber,
    accessCode,
    storedCodeInfo,
    userName
  });
  if (storedCodeInfo && storedCodeInfo.code === accessCode) {
    await db.ref(`accessCodes/${phoneNumber}`).remove();
    let users = await getUsers();
    let user = users.find((u) => u.phone === phoneNumber);
    if (!user) {
      // User mới
      user = {
        phone: phoneNumber,
        email: "",
        type: null,
        username: userName || "",
        studentName: userName || "",
        instructorName: userName || "",
        passwordHash: null
      };
      users.push(user);
      await db.ref("users").set(users);
      return res.status(200).json({
        success: true,
        userType: null,
        userName: user.username
      });
    } else {
      // User đã có, nếu có userName thì cập nhật các trường tên nếu chưa có
      let updated = false;
      if (userName) {
        if (!user.username || user.username !== userName) {
          user.username = userName;
          updated = true;
        }
        if (!user.studentName) {
          user.studentName = userName;
          updated = true;
        }
        if (!user.instructorName) {
          user.instructorName = userName;
          updated = true;
        }
      }
      if (updated) await db.ref("users").set(users);
      return res.status(200).json({
        success: true,
        userType: user.type,
        userName: user.username
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid access code."
    });
  }
});

/**
 * POST /loginEmail (This route is for sending access code to email, not for credential login)
 * Parameters: email
 * Return: a random 6-digit access code
 * Other requirement: save this access code to the code in the database and send code to email
 */
app.post("/loginEmail", async (req, res) => {
  const {
    email
  } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required."
    });
  }
  const code = generateAccessCode();
  await db.ref(`accessCodes/${email}`).set({
    code,
    type: "email"
  });
  sendEmail(email, "Your Access Code", `Your access code for login is: ${code}`);
  res.status(200).json({
    message: "Access code sent to email."
  });
});

/**
 * POST /validateAccessCodeEmail
 * Parameters: accessCode, email
 * Return: { success: true }
 * Other requirement: set the access code to empty string once validation is complete
 */
app.post("/validateAccessCodeEmail", async (req, res) => {
  const {
    email,
    accessCode

  } = req.body;
  if (!email || !accessCode) {
    return res.status(400).json({
      message: "Email and access code are required."
    });
  }
  const snap = await db.ref(`accessCodes/${email}`).once("value");
  const storedCodeInfo = snap.val();
  if (storedCodeInfo && storedCodeInfo.code === accessCode) {
    await db.ref(`accessCodes/${email}`).remove();
    const users = await getUsers();
    const user = users.find((u) => u.email === email);
    if (user) {
      return res.status(200).json({
        success: true,
        userType: user.type
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid access code."
    });
  }
});

/**
 * POST /login-credentials
 * Parameters: username, password
 * Action: Authenticate user with username and password
 */

app.post("/login-credentials", async (req, res) => {
  console.log("Nhận request login:", req.body);
  const {
    username,
    password
  } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required."
    });
  }
  console.log("Username gửi lên:", username, typeof username);
  console.log("Username nhận được:", username, typeof username);


  // Check admin first
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      userType: "admin",
      phoneNumber: username
    });
  }
  // User/instructor/student login as before
  const users = (await getUsers()).filter(Boolean);
  console.log("Danh sách users:", users);
  const user = users.find(
    (u) =>
    u &&
    (u.username === username ||
      String(u.phone) === String(username))
  );
  if (!user || !user.passwordHash) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password."
    });
  }
  console.log("So sánh password:", password, user.passwordHash);
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  console.log("Kết quả so sánh:", isPasswordValid);
  if (isPasswordValid) {
    return res.status(200).json({
      success: true,
      userType: user.type,
      phoneNumber: user.phone
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password."
    });
  }
});

// --- Instructor Routes ---
function randomPassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

app.post("/addInstructor", async (req, res) => {
  const {
    name,
    phone,
    email,
    subjects,
    experience,
    education,
    password,
    classroomId
  } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({
      message: "Name, phone, and email are required."
    });
  }
  // Kiểm tra trùng
  const instructorSnap = await db.ref(`instructors/${phone}`).once("value");
  if (instructorSnap.exists()) {
    return res.status(409).json({
      message: "Instructor with this phone number already exists."
    });
  }
  // Tạo classroomId nếu không được cung cấp
  let finalClassroomId = classroomId;
  if (!finalClassroomId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    finalClassroomId = result;
  }

  // Nếu không có password, random password
  let plainPassword = password;
  if (!plainPassword) {
    plainPassword = randomPassword(12);
  }
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // Lưu instructor vào Firebase
  const setupToken = uuidv4();
  const setupTokenExpires = Date.now() + 3600000;
  await db.ref(`instructors/${phone}`).set({
    name,
    phone,
    email,
    role: "instructor",
    subjects: subjects || [],
    experience: experience || "",
    education: education || "",
    setupToken,
    setupTokenExpires,
    isOnline: false,
    status: "active",
    canCreateClasses: true,
    joinDate: new Date().toISOString().split("T")[0],
    lastLogin: null,
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    completedLessons: 0,
    invitationCount: 0,
    acceptedInvitations: 0,
    rating: 0,
    classroomId: finalClassroomId // sử dụng classroomId đã tạo
  });
  // Thêm vào users
  const users = await getUsers();
  users.push({
    phone,
    email,
    type: "instructor",
    username: email, // cho phép login bằng email hoặc phone
    passwordHash
  });
  await db.ref("users").set(users);

  // Gửi password qua email cho giáo viên
  try {
    await sendEmail(
      email,
      "Thông tin tài khoản giáo viên",
      `Xin chào ${name},<br/>Tài khoản của bạn đã được tạo.<br/>Số điện thoại: <b>${phone}</b><br/>Mật khẩu đăng nhập: <b>${plainPassword}</b><br/>Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.`
    );
  } catch (err) {
    return res.status(201).json({
      message: "Instructor added, but failed to send email.",
      password: plainPassword,
      classroomId: finalClassroomId
    });
  }

  res.status(201).json({
    message: "Instructor added successfully. Password sent to email.",
    password: plainPassword,
    classroomId: finalClassroomId
  });
});
// List Instructor
app.get("/listInstructor", async (req, res) => {
  const instructors = await db.ref("instructors").once("value");
  res.status(200).json(instructors.val());
});

// Edit Instructor

app.put("/editInstructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const updates = req.body;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });

  // Nếu có trường password, yêu cầu oldPassword và kiểm tra
  if (updates.password) {
    if (!updates.oldPassword) {
      return res.status(400).json({
        message: "Old password is required."
      });
    }
    const users = await getUsers();
    const user = users.find(u => u.phone === phone);
    if (user) {
      const bcrypt = (await import('bcrypt')).default;
      const isMatch = await bcrypt.compare(updates.oldPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          message: "Old password is incorrect."
        });
      }
      user.passwordHash = await bcrypt.hash(updates.password, 10);
      await db.ref("users").set(users);
    }
    delete updates.password;
    delete updates.oldPassword;
  }

  // Nếu có trường email, cập nhật cho cả instructor và user
  if (typeof updates.email !== "undefined") {
    const users = await getUsers();
    const user = users.find(u => u.phone === phone);
    if (user) {
      user.email = updates.email;
      await db.ref("users").set(users);
    }
  }

  // Đảm bảo trường address được lưu vào instructor
  if (typeof updates.address !== "undefined") {
    await db.ref(`instructors/${phone}/address`).set(updates.address);
    delete updates.address;
  }

  // Cập nhật các trường còn lại
  await db.ref(`instructors/${phone}`).update(updates);
  res.status(200).json({
    message: "Instructor updated successfully."
  });
});

// Update Instructor
app.put("/editInstructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const updates = req.body;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  await db.ref(`instructors/${phone}`).update(updates);
  res.status(200).json({
    message: "Instructor updated successfully."
  });
});
// Delete Instructor

app.delete("/deleteInstructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  await db.ref(`instructors/${phone}`).remove();
  res.status(200).json({
    message: "Instructor deleted successfully."
  });
});

// Change status Instructor
app.put("/changeStatusInstructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const {
    status
  } = req.body;
  await db.ref(`instructors/${phone}`).update({
    isOnline: status
  });
  res.status(200).json({
    message: "Instructor status updated successfully."
  });
});

// Record Instructor
app.post("/recordInstructor", async (req, res) => {
  const {
    phone
  } = req.body;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  const instructor = snap.val();
});


/**
 * POST /addStudent
 * Params: name, phone, email
 * Action: Add new student to Firebase (in-memory), send email with setup link
 */
app.post("/addStudent", async (req, res) => {
  const {
    name,
    phone,
    email,
    classroomId
  } = req.body;
  if (!name || !phone || !email || !classroomId) {
    return res.status(400).json({
      message: "Name, phone, email, and classroomId are required."
    });
  }
  // Kiểm tra tồn tại user theo phone hoặc email
  const users = await getUsers();
  const userExists = users.find(
    u => u && (u.phone === phone || (u.email && u.email.toLowerCase() === email.toLowerCase()))
  );
  if (userExists) {
    // Gửi email mời với link login
    const loginLink = `http://localhost:5173/login`;
    const emailBody = `Bạn đã có tài khoản Classroom. Vui lòng đăng nhập tại đây: ${loginLink}`;
    try {
      await sendEmail(email, "Mời vào lớp học", emailBody);
      return res.status(200).json({
        message: "Tài khoản đã tồn tại, đã gửi email mời đăng nhập."
      });
    } catch (error) {
      return res.status(500).json({
        message: "Gửi email thất bại."
      });
    }
  }
  // Kiểm tra tồn tại student
  const studentSnap = await db.ref(`students/${phone}`).once("value");
  let classroomIds = [classroomId];
  if (studentSnap.exists()) {
    const student = studentSnap.val();
    // Nếu đã có classroomIds, thêm classroomId nếu chưa có
    if (Array.isArray(student.classroomIds)) {
      if (!student.classroomIds.includes(classroomId)) {
        classroomIds = [...student.classroomIds, classroomId];
      } else {
        classroomIds = student.classroomIds;
      }
    }
    // Cập nhật student với classroomIds mới
    await db.ref(`students/${phone}`).update({
      name,
      email,
      classroomIds,
    });
  } else {
    // Tạo mới student với classroomIds
    await db.ref(`students/${phone}`).set({
      name,
      phone,
      email,
      classroomIds,
      role: "student",
      lessons: {},
      isOnline: false,
    });
  }

  // Đảm bảo thêm vào users nếu chưa có
  if (!users.find(u => u.phone === phone)) {
    users.push({
      phone,
      email,
      type: "student",
      username: null,
      passwordHash: null
    });
    await db.ref("users").set(users);
  }
  // Gửi email như cũ...
  const setupLink = `http://localhost:5173/setup-account/${uuidv4()}`; // Frontend URL
  const emailBody = `Welcome to Classroom! Please set up your account using this link: ${setupLink}. This link will expire in 1 hour.`;
  try {
    await sendEmail(email, "Set Up Your Classroom Account", emailBody);
    // Add activity for student addition
    const activity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "student_added",
      text: `Sinh viên mới '${name}' đã được thêm vào lớp học`,
      time: new Date().toISOString(),
      studentName: name || "",
      studentPhone: phone || ""
    };
    await db.ref("activities").push(activity);
    // Broadcast student update to all connected clients
    io.emit("studentUpdate", {
      action: "added",
      student: {
        name,
        phone,
        email,
        role: "student",
        lessons: {},
        isOnline: false
      }
    });
    // Broadcast new activity
    io.emit("newActivity", activity);
    res.status(201).json({
      message: "Student added successfully. Setup email sent.",
      classroomIds,
    });
  } catch (error) {
    res.status(500).json({
      message: "Student added, but failed to send setup email."
    });
  }
});
// * POST /resendSetupEmail
//  * Params: phone
//  */
app.post("/resendSetupEmail", async (req, res) => {
  const {
    phone
  } = req.body;
  const studentSnap = await db.ref(`students/${phone}`).once("value");
  if (!studentSnap.exists()) return res.status(404).json({
    message: "Student not found."
  });

  const student = studentSnap.val();
  if (!student.setupToken || student.setupTokenExpires < Date.now())
    return res
      .status(400)
      .json({
        message: "Setup link expired. Add student again."
      });

  const setupLink = `http://localhost:5173/setup-account/${student.setupToken}`;
  const body = `Hi ${student.name}, here is your setup link again: ${setupLink}`;

  try {
    await sendEmail(student.email, "Your setup link", body);
    res.status(200).json({
      message: "Setup email resent."
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to resend email."
    });
  }
});

/**
 * POST /student/setup-account
 * Params: token, username, password
 * Action: Validate token, set username/password for student
 */
app.post("/student/setup-account", async (req, res) => {
  const {
    token,
    email,
    password
  } = req.body;
  if (!token || !email || !password) {
    return res.status(400).json({
      message: "Token, email, and password are required."
    });
  }

  // Tìm student theo token
  const studentsSnap = await db.ref("students").orderByChild("setupToken").equalTo(token).once("value");
  if (!studentsSnap.exists()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired setup link."
    });
  }

  // Lấy student object và phone
  const studentsObj = studentsSnap.val();
  const phone = Object.keys(studentsObj)[0];
  const student = studentsObj[phone];

  // So sánh email nhập vào với email đã mời (không phân biệt hoa thường, loại bỏ khoảng trắng)
  if (
    !student ||
    student.setupTokenExpires < Date.now() ||
    student.email.trim().toLowerCase() !== email.trim().toLowerCase()
  ) {
    return res.status(400).json({
      success: false,
      message: "Email không hợp lệ hoặc không khớp với email được mời."
    });
  }

  // Cập nhật username/password cho user có phone này
  const users = await getUsers();
  const user = users.find((u) => u.phone === phone);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User record not found for this student."
    });
  }
  try {
    const bcrypt = (await import('bcrypt')).default;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.username = email; // Lưu username là email
    user.passwordHash = hashedPassword;
    // Invalidate token
    student.setupToken = null;
    student.setupTokenExpires = null;
    // Lưu lại users và student
    await db.ref("students/" + phone).update({
      setupToken: null,
      setupTokenExpires: null
    });
    await db.ref("users").set(users);
    res.status(200).json({
      success: true,
      message: "Account set up successfully. You can now log in with your email and password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during account setup."
    });
  }
});
/**
 * POST /assignLesson
 * Params: studentPhone, title, description, deadline
 * Action: Save under student’s lesson list, optionally with descriptionFile
 */
app.post("/assignLesson", upload.single("descriptionFile"), async (req, res) => {
  const {
    studentPhone,
    title,
    description,
    deadline
  } = req.body;
  if (!studentPhone || !title || (!description && !req.file) || !deadline) {
    return res.status(400).json({
      message: "Student phone, title, deadline và mô tả (text hoặc file) là bắt buộc."
    });
  }
  const studentSnap = await db.ref(`students/${studentPhone}`).once("value");
  if (!studentSnap.exists()) {
    return res.status(404).json({
      message: "Student not found."
    });
  }
  const lessonId = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newLesson = {
    id: lessonId,
    title,
    description: description || null,
    descriptionFile: req.file ? req.file.filename : null,
    deadline,
    completed: false,
    closed: false,
  };
  await db.ref(`students/${studentPhone}/lessons/${lessonId}`).set(newLesson);

  // Add activity for lesson assignment
  const activity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "lesson_assigned",
    text: `Bài học '${title}' đã được gán cho ${student.name}`,
    time: new Date().toISOString(),
    studentName: student.name,
    studentPhone: student.phone,
    lessonTitle: title
  }
  await db.ref("activities").push(activity)

  // Broadcast lesson update to all connected clients
  io.emit("lessonUpdate", {
    studentPhone,
    lesson: newLesson,
    action: "added"
  })

  // Broadcast new activity
  io.emit("newActivity", activity)

  res.status(200).json({
    message: "Lesson assigned successfully.",
    lesson: newLesson
  });
})

/**
 * GET /students
 * Return list of all students with basic info
 */
app.get("/students", async (req, res) => {
  const snapshot = await db.ref("students").once("value");
  const students = snapshot.val() || {};
  // Thêm dòng log này:
  console.log("Raw students from Firebase:", students);
  const studentList = Object.values(students).map((s) => ({
    ...s,
    lessons: s.lessons ? Object.values(s.lessons) : [],
  }));
  res.status(200).json(studentList);
});
/**
 * GET /student/:phone
 * Return student profile and assigned lessons
 */
app.get("/student/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const snap = await db.ref(`students/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "User/Student not found."
  });
  const student = snap.val();
  student.lessons = student.lessons ? Object.values(student.lessons) : [];
  res.status(200).json(student);
})

/**
 * PUT /editStudent/:phone
 * Update student data
 */
app.put("/editStudent/:phone", (req, res) => {
  const {
    phone
  } = req.params
  const updates = req.body
  const student = students[phone]
  if (!student) {
    return res.status(404).json({
      message: "Student not found."
    })
  }

  Object.assign(student, updates)

  // Broadcast student update to all connected clients
  io.emit("studentUpdate", {
    action: "updated",
    student
  })

  res.status(200).json({
    message: "Student updated successfully.",
    student
  })
})

/**
 * DELETE /student/:phone
 * Remove student from Firebase (in-memory)
 */
app.delete("/student/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const snap = await db.ref(`students/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Student not found."
  });
  await db.ref(`students/${phone}`).remove();
  res.status(200).json({
    message: "Student removed successfully."
  });
})

// --- Student Routes ---

/**
 * GET /myLessons?phone=xxx
 * Return all assigned lessons
 */
app.get("/myLessons", async (req, res) => {
  const {
    phone
  } = req.query;
  if (!phone) return res.status(400).json({
    message: "Phone number is required."
  });
  const lessonsSnap = await db.ref(`students/${phone}/lessons`).once("value");
  const lessons = lessonsSnap.val() ? Object.values(lessonsSnap.val()) : [];
  res.status(200).json(lessons);
})

/**
 * POST /markLessonDone
 * Params: phone, lessonId
 * Mark lesson as completed in Firebase (in-memory)
 */
app.post("/markLessonDone", async (req, res) => {
  const {
    phone,
    lessonId
  } = req.body;
  if (!phone || !lessonId) return res.status(400).json({
    message: "Phone number and lesson ID are required."
  });
  const lessonSnap = await db.ref(`students/${phone}/lessons/${lessonId}`).once("value");
  if (!lessonSnap.exists()) return res.status(404).json({
    message: "Lesson not found."
  });
  const lesson = lessonSnap.val();
  if (lesson.deadline && new Date() > new Date(lesson.deadline)) {
    await db.ref(`students/${phone}/lessons/${lessonId}/closed`).set(true);
    return res.status(403).json({
      message: "Đã quá hạn nộp bài. Bài học đã bị đóng."
    });
  }
  await db.ref(`students/${phone}/lessons/${lessonId}/completed`).set(true);

  // Add activity for lesson completion
  const activity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "lesson_completed",
    text: `${student.name} đã hoàn thành bài học '${lesson.title}'`,
    time: new Date().toISOString(),
    studentName: student.name,
    studentPhone: student.phone,
    lessonTitle: lesson.title
  }
  await db.ref("activities").push(activity)

  // Broadcast lesson update to all connected clients
  io.emit("lessonUpdate", {
    studentPhone: phone,
    lesson,
    action: "updated"
  })

  // Broadcast new activity
  io.emit("newActivity", activity)

  res.status(200).json({
    message: "Lesson marked as completed."
  });
})

/**
 * PUT /editProfile
 * Params: phone, name, email, password, oldPassword
 * Update student profile and password
 */
app.put("/editProfile", async (req, res) => {
  const {
    phone,
    name,
    email,
    password,
    oldPassword
  } = req.body;
  if (!phone) return res.status(400).json({
    message: "Phone number is required."
  });
  const snap = await db.ref(`students/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Student not found."
  });

  // Cập nhật thông tin cơ bản
  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  await db.ref(`students/${phone}`).update(updates);

  // Xử lý cập nhật password
  if (password) {
    const users = await getUsers();
    const user = users.find(u => u.phone === phone);
    if (user) {
      const bcrypt = (await import('bcrypt')).default;

      // Kiểm tra xem user đã có password chưa
      if (user.passwordHash) {
        // Đã có password, cần nhập old password
        if (!oldPassword) {
          return res.status(400).json({
            message: "Old password is required to update password."
          });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({
            message: "Old password is incorrect."
          });
        }
      }
      // Cập nhật password mới
      user.passwordHash = await bcrypt.hash(password, 10);
      await db.ref("users").set(users);
    }
  }

  res.status(200).json({
    message: "Profile updated successfully."
  });
})

/**
 * GET /user/has-password/:phone
 * Check if user has password set
 */
app.get("/user/has-password/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  if (!phone) return res.status(400).json({
    message: "Phone number is required."
  });

  const users = await getUsers();
  const user = users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({
    message: "User not found."
  });

  res.status(200).json({
    hasPassword: !!user.passwordHash
  });
});

/**
 * PUT /editLesson/:studentPhone/:lessonId
 * Update lesson data
 */
app.put("/editLesson/:studentPhone/:lessonId", upload.single("descriptionFile"), async (req, res) => {
  const {
    studentPhone,
    lessonId
  } = req.params;
  const updates = req.body;
  const lessonSnap = await db.ref(`students/${studentPhone}/lessons/${lessonId}`).once("value");
  if (!lessonSnap.exists()) return res.status(404).json({
    message: "Lesson not found."
  });
  await db.ref(`students/${studentPhone}/lessons/${lessonId}`).update(updates);
  res.status(200).json({
    message: "Lesson updated successfully!"
  });
})

/**
 * DELETE /lesson/:studentPhone/:lessonId
 * Remove lesson from student
 */
app.delete("/lesson/:studentPhone/:lessonId", async (req, res) => {
  const {
    studentPhone,
    lessonId
  } = req.params;
  const lessonSnap = await db.ref(`students/${studentPhone}/lessons/${lessonId}`).once("value");
  if (!lessonSnap.exists()) return res.status(404).json({
    message: "Lesson not found."
  });
  await db.ref(`students/${studentPhone}/lessons/${lessonId}`).remove();
  res.status(200).json({
    message: "Lesson deleted successfully."
  });
})

/**
 * GET /students/with-lessons
 * Return list of all students with their lessons
 */
app.get("/students/with-lessons", (req, res) => {
  const studentList = Object.values(students).map(({
    name,
    phone,
    email,
    isOnline,
    lessons,
    role
  }) => ({
    name,
    phone,
    email,
    isOnline,
    lessons: lessons || [],
    role: role || "student"
  }))
  res.status(200).json(studentList)
})

/**
 * POST /assignLessonBulk
 * Assign lesson to multiple students
 */
app.post("/assignLessonBulk", upload.single("descriptionFile"), async (req, res) => {
  const {
    studentPhones,
    title,
    description,
    deadline
  } = req.body;
  if (!studentPhones || !Array.isArray(studentPhones) || !title || (!description && !req.file) || !deadline) {
    return res.status(400).json({
      message: "Student phones array, title, deadline và mô tả (text hoặc file) là bắt buộc.",
    });
  }
  const results = [];
  const errors = [];
  for (const studentPhone of studentPhones) {
    const studentSnap = await db.ref(`students/${studentPhone}`).once("value");
    if (!studentSnap.exists()) {
      errors.push(`Student ${studentPhone} not found`);
      continue;
    }
    const student = studentSnap.val();
    const lessonId = `lesson_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLesson = {
      id: lessonId,
      title,
      description: description || null,
      descriptionFile: req.file ? req.file.filename : null,
      deadline,
      completed: false,
      closed: false,
    };
    await db.ref(`students/${studentPhone}/lessons/${lessonId}`).set(newLesson);
    results.push({
      studentPhone,
      lesson: newLesson
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Some students not found",
      errors,
      results
    })
  }

  // Add activity for bulk lesson assignment
  const activity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "lesson_assigned",
    text: `Bài học '${title}' đã được gán cho ${results.length} sinh viên`,
    time: new Date().toISOString(),
    lessonTitle: title
  }
  await db.ref("activities").push(activity)

  // Broadcast lesson updates to all connected clients
  results.forEach(result => {
    io.emit("lessonUpdate", {
      studentPhone: result.studentPhone,
      lesson: result.lesson,
      action: "added"
    })
  })

  // Broadcast new activity
  io.emit("newActivity", activity)

  res.status(200).json({
    message: `Lesson assigned to ${results.length} students successfully.`,
    results
  })
})

/**
 * GET /activities
 * Return recent activities
 */
app.get("/activities", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const snapshot = await db.ref("activities").orderByChild("time").limitToLast(limit).once("value");
  const activitiesObj = snapshot.val() || {};
  // Sắp xếp giảm dần theo thời gian
  const activities = Object.values(activitiesObj).sort((a, b) => new Date(b.time) - new Date(a.time));
  res.status(200).json(activities);
});

/**
 * POST /addActivity
 * Add new activity to the system
 */
app.post("/addActivity", (req, res) => {
  const {
    type,
    text,
    studentName,
    studentPhone,
    lessonTitle
  } = req.body

  if (!type || !text) {
    return res.status(400).json({
      message: "Activity type and text are required."
    })
  }

  const newActivity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    text,
    time: new Date().toISOString(),
    studentName,
    studentPhone,
    lessonTitle
  }

  // Keep only last 100 activities
  if (activities.length > 100) {
    activities.splice(100)
  }

  // Broadcast activity to all connected clients
  io.emit("newActivity", newActivity)

  res.status(201).json({
    message: "Activity added successfully.",
    activity: newActivity
  })
})

/**
 * POST /submitAssignment
 * Params: lessonId, studentPhone, file (optional), link (optional), note (optional)
 * Action: Lưu bài nộp vào lesson, kiểm tra deadline, mark completed, gửi thông báo instructor
 */
app.post("/submitAssignment", upload.single("file"), async (req, res) => {
  const {
    lessonId,
    studentPhone,
    link,
    note
  } = req.body;
  if (!lessonId || !studentPhone) {
    return res.status(400).json({
      message: "Thiếu lessonId hoặc studentPhone."
    });
  }
  const lessonSnap = await db.ref(`students/${studentPhone}/lessons/${lessonId}`).once("value");
  if (!lessonSnap.exists()) {
    return res.status(404).json({
      message: "Không tìm thấy bài học."
    });
  }
  const lesson = lessonSnap.val();
  if (lesson.deadline && new Date() > new Date(lesson.deadline)) {
    await db.ref(`students/${studentPhone}/lessons/${lessonId}/closed`).set(true);
    return res.status(403).json({
      message: "Đã quá hạn nộp bài. Bài học đã bị đóng."
    });
  }
  const submission = {
    fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    link: link || null,
    note: note || null,
    submittedAt: new Date().toISOString(),
  };
  await db.ref(`students/${studentPhone}/lessons/${lessonId}/submission`).set(submission);
  await db.ref(`students/${studentPhone}/lessons/${lessonId}/completed`).set(true);

  // Add activity for lesson submission
  const activity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "lesson_submitted",
    text: `${student.name} đã nộp bài cho '${lesson.title}'`,
    time: new Date().toISOString(),
    studentName: student.name,
    studentPhone: student.phone,
    lessonTitle: lesson.title
  };
  await db.ref("activities").push(activity);

  // Broadcast lesson update to all connected clients
  io.emit("lessonUpdate", {
    studentPhone,
    lesson,
    action: "updated",
  });

  // Broadcast new activity
  io.emit("newActivity", activity);

  // Gửi thông báo về instructor (nếu có socket mapping)
  // (Có thể mở rộng: tìm instructor phụ trách student này)

  res.status(200).json({
    message: "Nộp bài thành công!"
  });
});

// --- Chat (Socket.io) ---
io.on("connection", (socket) => {
  const {
    phoneNumber,
    userType
  } = socket.handshake.auth;
  console.log(`A ${userType} user connected: ${phoneNumber} (Socket ID: ${socket.id})`);

  if (phoneNumber) {
    connectedUsers[socket.id] = {
      phoneNumber,
      userType
    };

    // Update online status for students
    if (userType === "student") {
      // Cập nhật trạng thái online trực tiếp trên Firebase
      db.ref(`students/${phoneNumber}/isOnline`).set(true);

      // Add activity for student joining
      db.ref(`students/${phoneNumber}`).once("value").then((studentSnap) => {
        if (studentSnap.exists()) {
          const student = studentSnap.val();
          // Lấy classroomId và instructorPhone
          const classroomId = student.classroomId;
          // Đảm bảo classroomId không undefined/null
          if (!classroomId) {
            console.error("classroomId is undefined or null when joining room");
            return;
          }
          db.ref("instructors").orderByChild("classroomId").equalTo(classroomId).once("value").then((instructorSnap) => {
            const instructors = instructorSnap.val() || {};
            const instructorPhone = Object.keys(instructors)[0];
            if (instructorPhone) {
              const roomId = `room_${classroomId}_${instructorPhone}_${phoneNumber}`;
              socket.join(roomId);
              console.log(`Student ${phoneNumber} joined room: ${roomId}`);
            }
          });
        }
      });
    } else if (userType === "instructor") {
      db.ref(`instructors/${phoneNumber}`).once("value").then((instructorSnap) => {
        if (instructorSnap.exists()) {
          const instructor = instructorSnap.val();
          const classroomId = instructor.classroomId;
          if (!classroomId) {
            console.error("classroomId is undefined or null when instructor joins student rooms");
            return;
          }
          db.ref("students").orderByChild("classroomId").equalTo(classroomId).once("value").then((studentsSnap) => {
            const students = studentsSnap.val() || {};
            Object.values(students).forEach((student) => {
              const roomId = `room_${classroomId}_${phoneNumber}_${student.phone}`;
              socket.join(roomId);
              console.log(`Instructor ${phoneNumber} joined room: ${roomId} for student ${student.phone}`);
            });
          });
        }
      });
    }
    // Gọi async broadcast
    broadcastOnlineStatus();
  }

  // Send existing messages relevant to the connected user
  socket.on("request messages", async ({
    classroomId,
    instructorPhone,
    studentPhone
  }) => {
    const roomId = `room_${classroomId}_${instructorPhone}_${studentPhone}`;
    const snap = await db.ref(`chatMessages/${roomId}`).once("value");
    const messages = snap.val() ? Object.values(snap.val()) : [];
    socket.emit("load messages", messages);
  });

  socket.on("chat message", async (msg) => {
    const {
      classroomId,
      instructorPhone,
      studentPhone,
      text,
      sender
    } = msg;
    const roomId = `room_${classroomId}_${instructorPhone}_${studentPhone}`;
    const message = {
      id: Date.now(),
      sender,
      phone: msg.phone,
      text,
      timestamp: new Date().toISOString(),
      roomId,
    };
    // Lưu vào Firebase
    await db.ref(`chatMessages/${roomId}`).push(message);
    io.to(roomId).emit("chat message", message);
  });

  socket.on("disconnect", () => {
    const disconnectedUser = connectedUsers[socket.id];
    if (disconnectedUser) {
      console.log(`User disconnected: ${disconnectedUser.phoneNumber} (Socket ID: ${socket.id})`);
      if (disconnectedUser.userType === "student") {
        // Cập nhật trạng thái offline trên Firebase
        db.ref(`students/${disconnectedUser.phoneNumber}/isOnline`).set(false);
      }
      delete connectedUsers[socket.id];
      broadcastOnlineStatus();
    } else {
      console.log("A user disconnected (unknown phone number)");
    }
  });
});
// #ADMIN 
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
app.post("/setRole", async (req, res) => {
  const {
    phoneNumber,
    role,
    info
  } = req.body;
  if (!phoneNumber || !role) {
    return res.status(400).json({
      message: "Phone number và role là bắt buộc."
    });
  }
  const users = await getUsers();
  const user = users.find((u) => u.phone === phoneNumber);
  if (!user) {
    return res.status(404).json({
      message: "Không tìm thấy user."
    });
  }
  user.type = role;
  await db.ref("users").set(users);

  if (role === "student") {
    // Lưu tên vào bảng students
    const name = user.username || (info && info.name) || "";
    await db.ref(`students/${phoneNumber}`).update({
      name,
      phone: phoneNumber,
      email: user.email || "",
      role: "student",
      classroomId: (info && info.classroomId) || "" // luôn có classroomId
    });
    return res.status(200).json({
      success: true,
      userType: "student"
    });
  } else if (role === "instructor") {
    // Lưu tên vào bảng instructors
    const name = user.username || (info && info.name) || "";
    await db.ref(`instructors/${phoneNumber}`).set({
      name,
      phone: phoneNumber,
      email: user.email || (info && info.email) || "",
      role: "instructor",
      subjects: info && info.subjects ? info.subjects : [],
      experience: info && info.experience ? info.experience : "",
      education: info && info.education ? info.education : "",
      isOnline: false,
      status: "active",
      canCreateClasses: true,
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: null,
      totalClasses: 0,
      activeClasses: 0,
      totalStudents: 0,
      completedLessons: 0,
      invitationCount: 0,
      acceptedInvitations: 0,
      rating: 0,
      classroomId: (info && info.classroomId) || "" // luôn có classroomId
    });
    return res.status(200).json({
      success: true,
      userType: "instructor"
    });
  } else {
    return res.status(400).json({
      message: "Role không hợp lệ."
    });
  }
});

// Thêm giáo viên mới
app.post("/addInstructor", async (req, res) => {
  const {
    name,
    phone,
    email,
    subjects,
    experience,
    education
  } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({
      message: "Name, phone, and email are required."
    });
  }
  // Kiểm tra trùng
  const instructorSnap = await db.ref(`instructors/${phone}`).once("value");
  if (instructorSnap.exists()) {
    return res.status(409).json({
      message: "Instructor with this phone number already exists."
    });
  }
  const setupToken = uuidv4();
  const setupTokenExpires = Date.now() + 3600000;
  await db.ref(`instructors/${phone}`).set({
    name,
    phone,
    email,
    role: "instructor",
    subjects: subjects || [],
    experience: experience || "",
    education: education || "",
    setupToken,
    setupTokenExpires,
    isOnline: false,
    status: "active",
    canCreateClasses: true,
    joinDate: new Date().toISOString().split("T")[0],
    lastLogin: null,
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    completedLessons: 0,
    invitationCount: 0,
    acceptedInvitations: 0,
    rating: 0
  });
  // Thêm vào users
  const users = await getUsers();
  users.push({
    phone,
    email,
    type: "instructor",
    username: null,
    passwordHash: null
  });
  await db.ref("users").set(users);
  res.status(201).json({
    message: "Instructor added successfully."
  });
});

// Lấy danh sách giáo viên
app.get("/instructors", async (req, res) => {
  const snapshot = await db.ref("instructors").once("value");
  const instructors = snapshot.val() || {};
  res.status(200).json(Object.values(instructors));
});

// Lấy chi tiết giáo viên
app.get("/instructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  res.status(200).json(snap.val());
});

// Cập nhật thông tin giáo viên
app.put("/editInstructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const updates = req.body;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  await db.ref(`instructors/${phone}`).update(updates);
  res.status(200).json({
    message: "Instructor updated successfully."
  });
});

// Xóa giáo viên
app.delete("/instructor/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  await db.ref(`instructors/${phone}`).remove();
  // Xóa khỏi users nếu cần
  const users = await getUsers();
  const newUsers = users.filter(u => u.phone !== phone);
  await db.ref("users").set(newUsers);
  res.status(200).json({
    message: "Instructor deleted successfully."
  });
});

// Đổi trạng thái hoạt động/tạm ngưng giáo viên
app.put("/toggleInstructorStatus/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  const instructor = snap.val();
  const newStatus = instructor.status === "active" ? "suspended" : "active";
  await db.ref(`instructors/${phone}/status`).set(newStatus);
  res.status(200).json({
    message: "Instructor status updated.",
    status: newStatus
  });
});

// Cấp/thu hồi quyền tạo lớp
app.put("/toggleInstructorClassCreation/:phone", async (req, res) => {
  const {
    phone
  } = req.params;
  const snap = await db.ref(`instructors/${phone}`).once("value");
  if (!snap.exists()) return res.status(404).json({
    message: "Instructor not found."
  });
  const instructor = snap.val();
  const newValue = !instructor.canCreateClasses;
  await db.ref(`instructors/${phone}/canCreateClasses`).set(newValue);
  res.status(200).json({
    message: "Instructor class creation permission updated.",
    canCreateClasses: newValue
  });
});

// Thêm API kiểm tra token setup-account
app.get("/student/check-setup-token", async (req, res) => {
  const {
    token
  } = req.query;
  console.log("Token nhận được:", `"${token}"`);
  const studentsSnap = await db.ref("students").orderByChild("setupToken").equalTo(token).once("value");
  console.log("studentsSnap.exists():", studentsSnap.exists());
  if (!studentsSnap.exists()) {
    // In ra toàn bộ students để debug
    const allStudents = await db.ref("students").once("value");
    console.log("Tất cả students:", allStudents.val());
    return res.status(400).json({
      hasAccount: false,
      message: "Invalid or expired token."
    });
  }
  const studentsObj = studentsSnap.val();
  const phone = Object.keys(studentsObj)[0];
  const student = studentsObj[phone];
  // Lấy user theo phone
  const users = await getUsers();
  const user = users.find((u) => u.phone === phone);
  if (user && user.username && user.passwordHash) {
    return res.status(200).json({
      hasAccount: true,
      email: user.username
    });
  }
  return res.status(200).json({
    hasAccount: false,
    email: student.email
  });
});

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log("Access codes:", getAccessCodes)
  console.log("Users:", getUsers)
  console.log("Students:", getStudents)



})