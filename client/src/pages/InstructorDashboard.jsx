"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import OneToOneChat from "../components/OneToOneChat";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Container,
  Stack,
  Card,
  CardContent,
  Grid,
  Chip,
  Drawer,
  ListItemButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Logout,
  Dashboard,
  Group,
  School,
  Message,
  Circle,
  Menu,
  Close,
  Person,
  TrendingUp,
  Assignment,
  CheckCircleOutline,
  HourglassEmpty,
  Notifications,
  Settings,
  Analytics,
  Book,
  Chat,
  People,
  Add,
} from "@mui/icons-material";
import OverviewTab from "../components/Instructor/OverviewTab";
import StudentManagementTab from "../components/Instructor/StudentManagementTab";
import LessonManagementTab from "../components/Instructor/LessonManagementTab";
import socket from "../services/socket";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function InstructorDashboard() {
  const { phoneNumber, userType, logout } = useAuth();
  const [value, setValue] = useState(0);
  const [instructorName, setInstructorName] = useState("Instructor");
  const [students, setStudents] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentForChat, setSelectedStudentForChat] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editInfo, setEditInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [instructorEmail, setInstructorEmail] = useState("");
  const [instructorAddress, setInstructorAddress] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue !== 3) {
      setSelectedStudentForChat(null);
    }
  };

  const fetchInstructor = async () => {
    setIsLoading(true);
    try {
      const instructorResponse = await api.get(`/instructor/${phoneNumber}`);
      if (instructorResponse.data) {
        setInstructorName(instructorResponse.data.name || "Instructor");
        setInstructorEmail(instructorResponse.data.email || "");
        setInstructorAddress(instructorResponse.data.address || "");
      }
    } catch (error) {
      console.error("Error fetching instructor info:", error);
      setSnackbar({
        open: true,
        message: "Failed to load instructor info.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const studentsResponse = await api.get("/students");
      setStudents(
        studentsResponse.data.map((student) => ({
          ...student,
          lessons: student.lessons ? Object.values(student.lessons) : [],
        }))
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      setSnackbar({
        open: true,
        message: "Failed to load students.",
        severity: "error",
      });
    }
  };
  const fetchProfile = async () => {
    const res = await api.get(`/instructor/${phoneNumber}`);
    const instructor = res.data;
    console.log("Dữ liệu instructor:", instructor); // <-- Log này sẽ cho bạn biết instructor có classroomId không
    // ... các xử lý khác
  };
  useEffect(() => {
    fetchProfile();

    if (phoneNumber && userType) {
      fetchInstructor();
      fetchStudents();

      if (!socket.connected) {
        socket.auth = { phoneNumber: phoneNumber, userType: userType };
        socket.connect();
      }

      socket.on("onlineUsersUpdate", (updatedStudents) => {
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            const updatedStudent = updatedStudents.find(
              (s) => s.phone === student.phone
            );
            return updatedStudent
              ? { ...student, isOnline: updatedStudent.isOnline }
              : student;
          })
        );
      });

      socket.on("lessonUpdate", (data) => {
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            if (student.phone === data.studentPhone) {
              let updatedLessons = [...(student.lessons || [])];

              switch (data.action) {
                case "added":
                  updatedLessons.push(data.lesson);
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

              return { ...student, lessons: updatedLessons };
            }
            return student;
          })
        );
      });

      socket.on("studentUpdate", (data) => {
        switch (data.action) {
          case "added":
            setStudents((prevStudents) => [...prevStudents, data.student]);
            break;
          case "updated":
            setStudents((prevStudents) =>
              prevStudents.map((student) =>
                student.phone === data.student.phone ? data.student : student
              )
            );
            break;
          case "deleted":
            setStudents((prevStudents) =>
              prevStudents.filter(
                (student) => student.phone !== data.studentPhone
              )
            );
            break;
          default:
            break;
        }
      });

      return () => {
        socket.off("onlineUsersUpdate");
        socket.off("lessonUpdate");
        socket.off("studentUpdate");
      };
    }
  }, [phoneNumber, userType]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const totalStudents = students.length;
  const onlineStudents = students.filter((student) => student.isOnline).length;
  const totalLessons = students.reduce(
    (total, student) =>
      total + (Array.isArray(student.lessons) ? student.lessons.length : 0),
    0
  );
  const completedLessons = students.reduce(
    (total, student) =>
      total +
      (Array.isArray(student.lessons)
        ? student.lessons.filter((lesson) => lesson.completed).length
        : 0),
    0
  );

  const renderDashboard = () => (
    <Box className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Profile Section */}
      <Card className="flex items-center p-6 mb-8 shadow-lg rounded-2xl bg-white/80 backdrop-blur">
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mr: 4,
            bgcolor: "primary.main",
            fontSize: 48,
          }}
        >
          <Person fontSize="inherit" />
        </Avatar>
        <Box>
          <Typography variant="h4" className="font-bold">
            {instructorName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {instructorEmail}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {instructorAddress}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          sx={{ ml: "auto" }}
          onClick={() => {
            setEditInfo({
              name: instructorName,
              email: instructorEmail,
              phone: phoneNumber,
              address: instructorAddress,
              password: "",
              oldPassword: "",
            });
            setEditOpen(true);
          }}
        >
          Edit Profile
        </Button>
      </Card>

      {/* Stats Section */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="rounded-2xl shadow-md bg-gradient-to-r from-indigo-500 to-blue-400 text-white">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: "white",
                    color: "indigo.500",
                    width: 56,
                    height: 56,
                  }}
                >
                  <People fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">{totalStudents}</Typography>
                  <Typography variant="body2">Total Students</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="rounded-2xl shadow-md bg-gradient-to-r from-green-400 to-green-600 text-white">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: "white",
                    color: "green.600",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Circle fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">{onlineStudents}</Typography>
                  <Typography variant="body2">Online Now</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="rounded-2xl shadow-md bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: "white",
                    color: "orange.500",
                    width: 56,
                    height: 56,
                  }}
                >
                  <Book fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">{totalLessons}</Typography>
                  <Typography variant="body2">Total Lessons</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="rounded-2xl shadow-md bg-gradient-to-r from-cyan-400 to-blue-300 text-white">
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    bgcolor: "white",
                    color: "cyan.600",
                    width: 56,
                    height: 56,
                  }}
                >
                  <CheckCircleOutline fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4">{completedLessons}</Typography>
                  <Typography variant="body2">Completed</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Overview Section */}
      <Paper className="p-6 rounded-2xl shadow bg-white/90">
        <OverviewTab students={students} />
      </Paper>
    </Box>
  );

  const navigationItems = [
    { id: 0, label: "Dashboard", icon: <Dashboard /> },
    { id: 1, label: "Students", icon: <Group /> },
    { id: 2, label: "Lessons", icon: <School /> },
    { id: 3, label: "Chat", icon: <Chat /> },
  ];

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen bg-gray-100">
        <CircularProgress />
        <Typography variant="h6" className="ml-4 text-gray-700">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50 flex">
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        className="bg-white shadow-sm lg:hidden"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileDrawerOpen(true)}
            className="text-gray-800"
          >
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            className="flex-1 text-gray-800 font-semibold"
          >
            Instructor Portal
          </Typography>
          <IconButton color="inherit" className="text-gray-800">
            <Notifications />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Paper
        elevation={3}
        className="hidden lg:block w-64 min-h-screen p-6 flex flex-col justify-between bg-white shadow-lg flex-shrink-0"
      >
        <Box>
          <Typography variant="h5" className="font-bold text-gray-800 mb-6">
            Instructor Portal
          </Typography>
          <Divider className="mb-4" />
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            {navigationItems.map((item) => (
              <Tab
                key={item.id}
                label={item.label}
                icon={item.icon}
                iconPosition="start"
                {...a11yProps(item.id)}
                className="justify-start py-3 px-4 rounded-md hover:bg-blue-50 mb-2"
              />
            ))}
          </Tabs>
        </Box>
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          startIcon={<Logout />}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
        >
          Logout
        </Button>
      </Paper>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        className="lg:hidden"
      >
        <Box className="w-64 p-6">
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h5" className="font-bold text-gray-800">
              Instructor Portal
            </Typography>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider className="mb-4" />
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.id} disablePadding className="mb-2">
                <ListItemButton
                  onClick={() => {
                    setValue(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  className={`rounded-lg ${
                    value === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <ListItemIcon
                    className={
                      value === item.id ? "text-blue-700" : "text-gray-600"
                    }
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box className="mt-auto pt-4">
            <Button
              variant="contained"
              color="error"
              onClick={logout}
              startIcon={<Logout />}
              fullWidth
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box className="flex-1 pt-16 lg:pt-0 overflow-auto mt-16">
        {value === 0 && renderDashboard()}
        {value === 1 && (
          <Box className="p-6">
            {/* <Typography variant="h4" className="font-bold mb-6">
              Student Management
            </Typography> */}
            <StudentManagementTab
              students={students}
              fetchStudents={fetchStudents}
              setSnackbar={setSnackbar}
            />
          </Box>
        )}
        {value === 2 && (
          <Box className="p-6">
            {/* <Typography variant="h4" className="font-bold mb-6">
              Lesson Management
            </Typography> */}
            <LessonManagementTab
              students={students}
              fetchStudents={fetchStudents}
              setSnackbar={setSnackbar}
            />
          </Box>
        )}
        {value === 3 && (
          <Box className="p-6">
            <Typography variant="h4" className="font-bold mb-6">
              Chat with Students
            </Typography>
            <Box className="flex h-full">
              {/* Student List Sidebar for Chat */}
              <Paper
                elevation={3}
                className="w-72 p-4 mr-4 rounded-lg shadow-md bg-white flex flex-col"
              >
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-700 mb-4"
                >
                  Students for Chat
                </Typography>
                <Divider className="mb-4" />
                <List className="flex-1 overflow-y-auto">
                  {students.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      No students available.
                    </Typography>
                  ) : (
                    students.map((student) => (
                      <ListItem
                        key={student.phone}
                        button
                        onClick={() => setSelectedStudentForChat(student)}
                        className={`mb-2 rounded-md ${
                          selectedStudentForChat?.phone === student.phone
                            ? "bg-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <ListItemIcon>
                          <Circle
                            fontSize="small"
                            className={
                              student.isOnline
                                ? "text-green-500"
                                : "text-gray-400"
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={student.name}
                          secondary={student.phone}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>

              {/* One-to-One Chat Area */}
              <Box className="flex-1">
                {selectedStudentForChat ? (
                  <OneToOneChat
                    currentUserPhone={phoneNumber}
                    targetUserPhone={selectedStudentForChat.phone}
                    targetUserName={selectedStudentForChat.name}
                    instructorPhone={phoneNumber}
                  />
                ) : (
                  <Paper
                    elevation={3}
                    className="p-6 rounded-lg shadow-md h-full flex items-center justify-center"
                  >
                    <Typography variant="h6" color="textSecondary">
                      Select a student to start chatting.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        className="lg:hidden fixed bottom-4 right-4"
        onClick={() => setValue(3)}
      >
        <Chat />
      </Fab>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Instructor Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editInfo.name}
            onChange={(e) => setEditInfo({ ...editInfo, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editInfo.email}
            onChange={(e) =>
              setEditInfo({ ...editInfo, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={editInfo.phone}
            onChange={(e) =>
              setEditInfo({ ...editInfo, phone: e.target.value })
            }
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Address"
            value={editInfo.address}
            onChange={(e) =>
              setEditInfo({ ...editInfo, address: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Old Password"
            value={editInfo.oldPassword || ""}
            onChange={(e) =>
              setEditInfo({ ...editInfo, oldPassword: e.target.value })
            }
            fullWidth
            margin="normal"
            type="password"
            autoComplete="current-password"
          />
          <TextField
            label="New Password"
            value={editInfo.password}
            onChange={(e) =>
              setEditInfo({ ...editInfo, password: e.target.value })
            }
            fullWidth
            margin="normal"
            type="password"
            autoComplete="new-password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              const updateData = { ...editInfo };
              if (!updateData.password) {
                delete updateData.password;
                delete updateData.oldPassword;
              }
              await api.put(`/editInstructor/${editInfo.phone}`, updateData);
              setEditOpen(false);
              fetchInstructor(); // Re-fetch instructor data after update
              setSnackbar({
                open: true,
                message: "Cập nhật thành công!",
                severity: "success",
              });
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InstructorDashboard;
