"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import OneToOneChat from "../components/OneToOneChat";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Divider,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Avatar,
  Badge,
  LinearProgress,
  Tooltip,
  Fab,
  Drawer,
  ListItemIcon,
  ListItemButton,
  Container,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle,
  Assignment,
  Message,
  Logout,
  CheckCircleOutline,
  HourglassEmpty,
  Edit,
  Notifications,
  School,
  TrendingUp,
  CalendarToday,
  AccessTime,
  Star,
  Menu,
  Close,
  Person,
  Email,
  Phone,
  Dashboard,
  Book,
  Chat,
  Settings,
  NotificationsActive,
  NotificationsOff,
  Visibility,
  VisibilityOff,
  Lock,
} from "@mui/icons-material";
import socket from "../services/socket";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

function StudentDashboard() {
  const { phoneNumber, userType, logout } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: phoneNumber,
    password: "",
    oldPassword: "",
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileError, setEditProfileError] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);

  // Hardcode instructor's phone number for student's 1-1 chat
  const INSTRUCTOR_PHONE_NUMBER = "1234567890";

  // State cho nộp bài từng lesson
  const [submissionData, setSubmissionData] = useState({});

  const fetchMyLessons = async () => {
    try {
      const response = await api.get(`/myLessons?phone=${phoneNumber}`);
      setLessons(response.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message: "Failed to fetch lessons.",
      //   severity: "error",
      // });
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await api.get(`/student/${phoneNumber}`);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message: "Failed to fetch profile data.",
      //   severity: "error",
      // });
    }
  };

  // checkHasPassword and useEffect for socket are removed as per new_code

  useEffect(() => {
    if (phoneNumber && userType) {
      fetchMyLessons();
      fetchProfileData();
      // checkHasPassword(); // This line is removed

      // Connect Socket.io and send auth data
      if (!socket.connected) {
        socket.auth = { phoneNumber: phoneNumber, userType: userType };
        socket.connect();
      }

      // Listen for lesson updates specific to this student
      socket.on("lessonUpdate", (data) => {
        if (data.studentPhone === phoneNumber) {
          setLessons((prevLessons) => {
            let updatedLessons = [...prevLessons];
            let existingLesson;

            switch (data.action) {
              case "added":
                existingLesson = updatedLessons.find(
                  (lesson) => lesson.id === data.lesson.id
                );
                if (!existingLesson) {
                  const newLesson = { ...data.lesson, isNew: true };
                  updatedLessons.push(newLesson);
                  setTimeout(() => {
                    setLessons((prevLessons) =>
                      prevLessons.map((lesson) =>
                        lesson.id === data.lesson.id
                          ? { ...lesson, isNew: false }
                          : lesson
                      )
                    );
                  }, 10000);
                }
                break;
              case "updated":
                updatedLessons = updatedLessons.map((lesson) =>
                  lesson.id === data.lesson.id ? data.lesson : lesson
                );
                break;
              case "deleted":
                updatedLessons = updatedLessons.filter(
                  (lesson) => lesson.id !== data.lesson.id
                );
                break;
              default:
                break;
            }

            return updatedLessons;
          });
        }
      });

      return () => {
        socket.off("lessonUpdate");
      };
    }
  }, [phoneNumber, userType]);

  const handleMarkLessonDone = async (lessonId) => {
    try {
      await api.post("/markLessonDone", { phone: phoneNumber, lessonId });
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message: "Lesson marked as completed!",
      //   severity: "success",
      // });

      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      );
    } catch (error) {
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message: error.response?.data?.message || "Failed to mark lesson done.",
      //   severity: "error",
      // });
    }
  };

  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const totalLessons = lessons.length;
  const completionRate =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Hàm xử lý thay đổi input nộp bài
  const handleSubmissionChange = (lessonId, field, value) => {
    setSubmissionData((prev) => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [field]: value,
      },
    }));
  };

  // Hàm nộp bài tập
  const handleSubmitAssignment = async (lessonId) => {
    const submission = submissionData[lessonId] || {};
    if (!submission.file && !submission.link) {
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message: "Vui lòng nộp file hoặc nhập link bài tập!",
      //   severity: "warning",
      // });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("lessonId", lessonId);
      formData.append("studentPhone", phoneNumber);
      if (submission.file) formData.append("file", submission.file);
      if (submission.link) formData.append("link", submission.link);
      if (submission.note) formData.append("note", submission.note);
      await api.post("/submitAssignment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message: "Nộp bài thành công!",
      //   severity: "success",
      // });
      // Cập nhật lại lessons
      fetchMyLessons();
      // Xóa dữ liệu nộp bài ở form
      setSubmissionData((prev) => ({ ...prev, [lessonId]: {} }));
    } catch (error) {
      // setSnackbar({ // This line is removed
      //   open: true,
      //   message:
      //     error.response?.data?.message ||
      //     "Nộp bài thất bại. Vui lòng thử lại!",
      //   severity: "error",
      // });
    }
  };

  const renderDashboard = () => (
    <Box>
      <Typography component="h1" variant="h5" mb={3} fontWeight="bold">
        Bảng điều khiển học sinh
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Tổng số bài học
              </Typography>
              <Typography variant="h4" color="primary">
                {lessons.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Đã hoàn thành
              </Typography>
              <Typography variant="h4" color="success.main">
                {lessons.filter((l) => l.completed).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Đang chờ hoàn thành
              </Typography>
              <Typography variant="h4" color="warning.main">
                {lessons.filter((l) => !l.completed).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Tiến độ học tập
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  lessons.length
                    ? (lessons.filter((l) => l.completed).length /
                        lessons.length) *
                      100
                    : 0
                }
                sx={{ height: 16, borderRadius: 8 }}
              />
              <Typography variant="body2" mt={2}>
                {lessons.filter((l) => l.completed).length} / {lessons.length}{" "}
                bài học đã hoàn thành
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Bài học gần nhất
              </Typography>
              {lessons.length > 0 ? (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {lessons[lessons.length - 1].title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hạn nộp: {lessons[lessons.length - 1].deadline}
                  </Typography>
                  <Typography variant="body2">
                    Trạng thái:{" "}
                    {lessons[lessons.length - 1].completed
                      ? "Đã hoàn thành"
                      : "Chưa hoàn thành"}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có bài học nào.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderLessons = () => (
    <Box className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        My Lessons
      </Typography>
      <Grid container spacing={3}>
        {lessons.length === 0 ? (
          <Grid item xs={12}>
            <Card elevation={2} className="rounded-xl">
              <CardContent className="text-center py-12">
                <School sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
                <Typography variant="h5" color="textSecondary" className="mb-2">
                  No lessons assigned yet
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Your instructor will assign lessons soon. Check back later!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          lessons.map((lesson) => {
            const isClosed =
              lesson.closed ||
              (lesson.deadline && new Date() > new Date(lesson.deadline));
            const isCompleted = lesson.completed;
            const submission = submissionData[lesson.id] || {};
            return (
              <Grid item xs={12} md={6} lg={4} key={lesson.id}>
                <Card
                  elevation={2}
                  className="rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <Stack spacing={3}>
                      <Box>
                        <Typography
                          variant="h6"
                          className={`font-semibold mb-2 ${
                            lesson.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {lesson.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          className={lesson.completed ? "line-through" : ""}
                        >
                          {lesson.description}
                        </Typography>
                        {lesson.descriptionFile && (
                          <Button
                            size="small"
                            variant="outlined"
                            href={`http://localhost:3001/download-description/${lesson.descriptionFile}`}
                            target="_blank"
                            sx={{ mt: 1 }}
                          >
                            Download Description File
                          </Button>
                        )}
                        {lesson.deadline && (
                          <Typography
                            variant="caption"
                            color={isClosed ? "error" : "textSecondary"}
                            sx={{ display: "block", mt: 1 }}
                          >
                            Deadline:{" "}
                            {format(
                              new Date(lesson.deadline),
                              "dd/MM/yyyy HH:mm"
                            )}
                          </Typography>
                        )}
                        {isClosed && (
                          <Chip
                            label="Closed"
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={
                            lesson.completed
                              ? "Completed"
                              : isClosed
                              ? "Closed"
                              : "Pending"
                          }
                          color={
                            lesson.completed
                              ? "success"
                              : isClosed
                              ? "error"
                              : "warning"
                          }
                          icon={
                            lesson.completed ? (
                              <CheckCircleOutline />
                            ) : isClosed ? (
                              <HourglassEmpty />
                            ) : (
                              <HourglassEmpty />
                            )
                          }
                        />
                        {lesson.completed && (
                          <Chip
                            label="100%"
                            color="success"
                            size="small"
                            icon={<Star />}
                          />
                        )}
                      </Stack>
                      {/* Form nộp bài */}
                      {!isCompleted && !isClosed && (
                        <Box component="form" noValidate>
                          <Typography variant="subtitle1" className="mb-2">
                            Nộp bài tập
                          </Typography>
                          <Stack spacing={2}>
                            <Button variant="outlined" component="label">
                              Upload file bài tập
                              <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                  handleSubmissionChange(
                                    lesson.id,
                                    "file",
                                    e.target.files[0]
                                  )
                                }
                              />
                            </Button>
                            {submission.file && (
                              <Typography variant="caption">
                                {submission.file.name}
                              </Typography>
                            )}
                            <TextField
                              label="Link bài tập (nếu có)"
                              fullWidth
                              value={submission.link || ""}
                              onChange={(e) =>
                                handleSubmissionChange(
                                  lesson.id,
                                  "link",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                            />
                            <TextField
                              label="Ghi chú bài làm (nếu có)"
                              fullWidth
                              multiline
                              rows={2}
                              value={submission.note || ""}
                              onChange={(e) =>
                                handleSubmissionChange(
                                  lesson.id,
                                  "note",
                                  e.target.value
                                )
                              }
                              variant="outlined"
                            />
                            {/* Nút nộp bài sẽ xử lý ở bước sau */}
                            <Button
                              variant="contained"
                              fullWidth
                              color="primary"
                              onClick={() => handleSubmitAssignment(lesson.id)}
                              disabled={false}
                            >
                              Nộp bài & Mark as Completed
                            </Button>
                          </Stack>
                        </Box>
                      )}
                      {/* Nếu đã quá hạn và chưa completed, disable form */}
                      {!isCompleted && isClosed && (
                        <Box>
                          <Typography color="error" variant="body2">
                            Đã quá hạn, không thể nộp bài.
                          </Typography>
                        </Box>
                      )}
                      {/* Nếu đã completed, hiển thị thông tin bài đã nộp */}
                      {isCompleted && lesson.submission && (
                        <Box>
                          <Typography variant="subtitle2" className="mb-1">
                            Đã nộp bài:
                          </Typography>
                          {lesson.submission.fileUrl && (
                            <Button
                              size="small"
                              variant="outlined"
                              href={lesson.submission.fileUrl}
                              target="_blank"
                              sx={{ mr: 1 }}
                            >
                              File đã nộp
                            </Button>
                          )}
                          {lesson.submission.link && (
                            <Button
                              size="small"
                              variant="outlined"
                              href={lesson.submission.link}
                              target="_blank"
                              sx={{ mr: 1 }}
                            >
                              Link đã nộp
                            </Button>
                          )}
                          {lesson.submission.note && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Ghi chú: {lesson.submission.note}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );

  const renderChat = () => (
    <Box className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        Chat with Instructor
      </Typography>
      <Card elevation={2} className="rounded-xl">
        <CardContent className="p-0">
          <OneToOneChat
            currentUserPhone={phoneNumber}
            targetUserPhone={INSTRUCTOR_PHONE_NUMBER}
            targetUserName="Instructor"
            instructorPhone={INSTRUCTOR_PHONE_NUMBER}
          />
        </CardContent>
      </Card>
    </Box>
  );

  // Thêm hàm renderProfile nếu chưa có
  const handleOpenEditProfile = async () => {
    setEditProfileData({
      name: profileData.name,
      email: profileData.email,
      password: "",
      oldPassword: "",
    });
    setEditProfileError("");
    setCheckingPassword(true);
    try {
      const res = await api.get(`/user/has-password/${profileData.phone}`);
      setHasPassword(res.data.hasPassword);
    } catch {
      setHasPassword(false);
    } finally {
      setCheckingPassword(false);
      setEditProfileOpen(true);
    }
  };
  const handleCloseEditProfile = () => setEditProfileOpen(false);

  // Gửi cập nhật hồ sơ
  const handleSaveEditProfile = async () => {
    setEditProfileLoading(true);
    setEditProfileError("");
    try {
      const updateData = {
        name: editProfileData.name,
        email: editProfileData.email,
      };
      if (editProfileData.password) {
        if (hasPassword) {
          if (!editProfileData.oldPassword) {
            setEditProfileError(
              "Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới."
            );
            setEditProfileLoading(false);
            return;
          }
          updateData.oldPassword = editProfileData.oldPassword;
        }
        updateData.password = editProfileData.password;
      }
      await api.put(`/editStudent/${profileData.phone}`, updateData);
      setProfileData((prev) => ({
        ...prev,
        name: editProfileData.name,
        email: editProfileData.email,
      }));
      setEditProfileOpen(false);
    } catch (err) {
      setEditProfileError(
        err.response?.data?.message || "Cập nhật hồ sơ thất bại."
      );
    } finally {
      setEditProfileLoading(false);
    }
  };

  const renderProfile = () => (
    <Card>
      <CardContent>
        <Typography component="h2" variant="h5" mb={2}>
          Hồ sơ cá nhân
        </Typography>
        <Typography variant="body1">Tên: {profileData.name}</Typography>
        <Typography variant="body1">Email: {profileData.email}</Typography>
        <Typography variant="body1">
          Số điện thoại: {profileData.phone}
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={handleOpenEditProfile}
        >
          Chỉnh sửa hồ sơ
        </Button>
      </CardContent>
      <Dialog
        open={editProfileOpen}
        onClose={handleCloseEditProfile}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            fullWidth
            margin="normal"
            value={editProfileData.name}
            onChange={(e) =>
              setEditProfileData((d) => ({ ...d, name: e.target.value }))
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={editProfileData.email}
            onChange={(e) =>
              setEditProfileData((d) => ({ ...d, email: e.target.value }))
            }
          />
          {checkingPassword ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              py={2}
            >
              <CircularProgress size={24} />
            </Box>
          ) : (
            <>
              {hasPassword && (
                <TextField
                  label="Mật khẩu cũ"
                  fullWidth
                  margin="normal"
                  type="password"
                  value={editProfileData.oldPassword || ""}
                  onChange={(e) =>
                    setEditProfileData((d) => ({
                      ...d,
                      oldPassword: e.target.value,
                    }))
                  }
                />
              )}
              <TextField
                label={hasPassword ? "Mật khẩu mới" : "Tạo mật khẩu mới"}
                fullWidth
                margin="normal"
                type="password"
                value={editProfileData.password}
                onChange={(e) =>
                  setEditProfileData((d) => ({
                    ...d,
                    password: e.target.value,
                  }))
                }
              />
            </>
          )}
          {editProfileError && (
            <Typography color="error" variant="body2">
              {editProfileError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProfile}>Hủy</Button>
          <Button
            onClick={handleSaveEditProfile}
            variant="contained"
            disabled={editProfileLoading || checkingPassword}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar trái */}
      <Box
        component="nav"
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          display: { xs: "none", md: "block" },
        }}
      >
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Avatar
            src={profileData.avatarUrl}
            alt={profileData.name}
            sx={{ width: 64, height: 64, mx: "auto", mb: 1 }}
          />
          <Typography variant="h6">{profileData.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profileData.email}
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem
            button
            selected={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            selected={activeTab === "lessons"}
            onClick={() => setActiveTab("lessons")}
          >
            <ListItemIcon>
              <Book />
            </ListItemIcon>
            <ListItemText primary="Bài học" />
          </ListItem>
          <ListItem
            button
            selected={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
          >
            <ListItemIcon>
              <Chat />
            </ListItemIcon>
            <ListItemText primary="Chat" />
          </ListItem>
          <ListItem
            button
            selected={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Hồ sơ" />
          </ListItem>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </Box>
      {/* Nội dung phải */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
        {activeTab === "dashboard" && renderDashboard && renderDashboard()}
        {activeTab === "lessons" && renderLessons && renderLessons()}
        {activeTab === "chat" && (
          <OneToOneChat
            studentPhone={phoneNumber}
            instructorPhone={INSTRUCTOR_PHONE_NUMBER}
          />
        )}
        {activeTab === "profile" && renderProfile()}
      </Box>
    </Box>
  );
}

export default StudentDashboard;
