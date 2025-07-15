"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import { addStudent, editStudent, deleteStudent } from "../../services/student";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Snackbar,
  Alert,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Checkbox,
  FormControlLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Tooltip,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  AccountCircle,
  Group,
  Assignment,
  Email,
  Phone,
  School,
  Visibility,
  ViewList,
  ViewModule,
  Person,
  CheckCircleOutline,
  HourglassEmpty,
  Circle,
  MoreVert,
  Book,
  Message,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

function StudentManagementTab({
  students,
  fetchStudents,
  // classroomId,
  setSnackbar,
}) {
  const [openAddStudentDialog, setOpenAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    phone: "",
    email: "",
    classroomId: "",
    role: "student",
  });
  const [openEditStudentDialog, setOpenEditStudentDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [openBulkLessonDialog, setOpenBulkLessonDialog] = useState(false);
  const [bulkLessonData, setBulkLessonData] = useState({
    title: "",
    description: "",
    selectedStudents: [],
  });
  const [viewMode, setViewMode] = useState("cards");

  const roles = [
    { value: "student", label: "Student" },
    { value: "assistant", label: "Assistant" },
    { value: "team_member", label: "Team Member" },
  ];
  useEffect(() => {
    console.log("students:", students);
    console.log("students is array:", Array.isArray(students));
  }, [students]);
  const handleChange = (e) => {
    setNewStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddStudent = async () => {
    try {
      const studentData = {
        ...newStudent,
        email: newStudent.email.trim(),
        classroomId: localStorage.getItem("classroomId"),
      };
      console.log("Dữ liệu gửi lên:", studentData);
      await addStudent(studentData);
      setSnackbar({
        open: true,
        message: "Student added successfully! Setup email sent.",
        severity: "success",
      });
      setOpenAddStudentDialog(false);
      setNewStudent({ name: "", phone: "", email: "", role: "student" });
      fetchStudents();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to add student.",
        severity: "error",
      });
    }
  };

  const handleEditStudent = async () => {
    try {
      await editStudent(currentStudent.phone, currentStudent);
      setSnackbar({
        open: true,
        message: "Student updated successfully!",
        severity: "success",
      });
      setOpenEditStudentDialog(false);
      setCurrentStudent(null);
      fetchStudents();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update student.",
        severity: "error",
      });
    }
  };

  const handleDeleteStudent = async (phone) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(phone);
        setSnackbar({
          open: true,
          message: "Student deleted successfully!",
          severity: "success",
        });
        fetchStudents();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to delete student.",
          severity: "error",
        });
      }
    }
  };

  const handleBulkLessonAssignment = async () => {
    try {
      const promises = bulkLessonData.selectedStudents.map((studentPhone) =>
        api.post("/assignLesson", {
          studentPhone,
          title: bulkLessonData.title,
          description: bulkLessonData.description,
        })
      );

      await Promise.all(promises);
      setSnackbar({
        open: true,
        message: `Lesson assigned to ${bulkLessonData.selectedStudents.length} students successfully!`,
        severity: "success",
      });
      setOpenBulkLessonDialog(false);
      setBulkLessonData({ title: "", description: "", selectedStudents: [] });
      fetchStudents();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          "Failed to assign lesson to some students.",
        severity: "error",
      });
    }
  };

  const handleStudentSelection = (studentPhone) => {
    setBulkLessonData((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentPhone)
        ? prev.selectedStudents.filter((phone) => phone !== studentPhone)
        : [...prev.selectedStudents, studentPhone],
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "assistant":
        return "success";
      case "team_member":
        return "warning";
      default:
        return "primary";
    }
  };

  const getRoleLabel = (role) => {
    return roles.find((r) => r.value === role)?.label || role;
  };

  const renderStudentCard = (student) => {
    const lessonsArr = Array.isArray(student.lessons)
      ? student.lessons
      : Object.values(student.lessons || {});
    const completedLessons = lessonsArr.filter(
      (lesson) => lesson.completed
    ).length;
    const totalLessons = lessonsArr.length;
    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return (
      <Card
        key={student.phone}
        elevation={2}
        className="rounded-xl hover:shadow-lg transition-all duration-300"
      >
        <CardContent className="p-6">
          <Box className="flex items-start justify-between mb-4">
            <Box className="flex items-center space-x-3">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: student.isOnline ? "success.main" : "grey.400",
                }}
              >
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6" className="font-semibold">
                  {student.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {student.phone}
                </Typography>
                <Chip
                  label={getRoleLabel(student.role)}
                  color={getRoleColor(student.role)}
                  size="small"
                  className="mt-1"
                />
              </Box>
            </Box>
            <Box className="flex items-center space-x-1">
              <Circle
                fontSize="small"
                className={
                  student.isOnline ? "text-green-500" : "text-gray-400"
                }
              />
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          <Divider className="my-3" />

          <Stack spacing={2}>
            <Box>
              <Typography
                variant="body2"
                color="textSecondary"
                className="mb-1"
              >
                Progress: {completedLessons}/{totalLessons} lessons
              </Typography>
              <Box className="flex items-center space-x-2">
                <Box className="flex-1">
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 4 }}
                    color="success"
                  />
                </Box>
                <Typography
                  variant="body2"
                  className="font-medium text-green-600"
                >
                  {progress}%
                </Typography>
              </Box>
            </Box>

            <Box className="flex items-center justify-between">
              <Box className="flex items-center space-x-4">
                <Box className="text-center">
                  <Typography variant="h6" className="font-bold text-blue-600">
                    {totalLessons}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography variant="h6" className="font-bold text-green-600">
                    {completedLessons}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
                <Box className="text-center">
                  <Typography
                    variant="h6"
                    className="font-bold text-orange-600"
                  >
                    {totalLessons - completedLessons}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Stack>
        </CardContent>

        <CardActions className="p-4 pt-0">
          <Stack direction="row" spacing={1} className="w-full">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => {
                setCurrentStudent(student);
                setOpenEditStudentDialog(true);
              }}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Book />}
              onClick={() => {
                setBulkLessonData((prev) => ({
                  ...prev,
                  selectedStudents: [student.phone],
                }));
                setOpenBulkLessonDialog(true);
              }}
              className="flex-1"
            >
              Assign Lesson
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={() => handleDeleteStudent(student.phone)}
              className="flex-1"
            >
              Delete
            </Button>
          </Stack>
        </CardActions>
      </Card>
    );
  };

  const renderStudentTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Student</TableCell>
            <TableCell className="font-semibold">Contact</TableCell>
            <TableCell className="font-semibold">Role</TableCell>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell className="font-semibold">Progress</TableCell>
            <TableCell className="font-semibold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => {
            const lessonsArr = Array.isArray(student.lessons)
              ? student.lessons
              : Object.values(student.lessons || {});
            const completedLessons = lessonsArr.filter(
              (lesson) => lesson.completed
            ).length;
            const totalLessons = lessonsArr.length;
            const progress =
              totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;

            return (
              <TableRow key={student.phone} className="hover:bg-gray-50">
                <TableCell>
                  <Box className="flex items-center space-x-2">
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="body2" className="font-medium">
                      {student.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{student.phone}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {student.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(student.role)}
                    color={getRoleColor(student.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box className="flex items-center space-x-1">
                    <Circle
                      fontSize="small"
                      className={
                        student.isOnline ? "text-green-500" : "text-gray-400"
                      }
                    />
                    <Typography variant="body2">
                      {student.isOnline ? "Online" : "Offline"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="flex items-center space-x-2">
                    <Box className="flex-1">
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 6, borderRadius: 3 }}
                        color="success"
                      />
                    </Box>
                    <Typography variant="body2" className="font-medium">
                      {progress}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentStudent(student);
                        setOpenEditStudentDialog(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteStudent(student.phone)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box className="mb-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4" className="font-bold">
            Student Management
          </Typography>
          <Stack direction="row" spacing={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="cards">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="table">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddStudentDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Student
            </Button>
          </Stack>
        </Box>

        <Typography variant="body1" color="textSecondary" className="mb-6">
          Manage your students, view their progress, and assign lessons
          efficiently.
        </Typography>
      </Box>

      {students.length === 0 ? (
        <Card elevation={2} className="rounded-xl">
          <CardContent className="text-center py-12">
            <Group sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
            <Typography variant="h5" color="textSecondary" className="mb-2">
              No students yet
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Start by adding your first student to the class.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddStudentDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add First Student
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        <Grid container spacing={3}>
          {students.map(renderStudentCard)}
        </Grid>
      ) : (
        renderStudentTable()
      )}

      {/* Add Student Dialog */}
      <Dialog
        open={openAddStudentDialog}
        onClose={() => setOpenAddStudentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Add New Student
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={newStudent.name}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <Person className="mr-2 text-gray-400" />,
            }}
          />
          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            value={newStudent.phone}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <Phone className="mr-2 text-gray-400" />,
            }}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={newStudent.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              startAdornment: <Email className="mr-2 text-gray-400" />,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={newStudent.role}
              onChange={handleChange}
              label="Role"
              startAdornment={<School className="mr-2 text-gray-400" />}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenAddStudentDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddStudent}
            variant="contained"
            color="primary"
          >
            Add Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog
        open={openEditStudentDialog}
        onClose={() => setOpenEditStudentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Edit Student
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Name"
            fullWidth
            value={currentStudent?.name || ""}
            onChange={(e) =>
              setCurrentStudent({ ...currentStudent, name: e.target.value })
            }
            variant="outlined"
            InputProps={{
              startAdornment: <Person className="mr-2 text-gray-400" />,
            }}
          />
          <TextField
            label="Phone Number"
            fullWidth
            value={currentStudent?.phone || ""}
            disabled
            variant="outlined"
            InputProps={{
              startAdornment: <Phone className="mr-2 text-gray-400" />,
            }}
          />
          <TextField
            label="Email"
            fullWidth
            value={currentStudent?.email || ""}
            onChange={(e) =>
              setCurrentStudent({ ...currentStudent, email: e.target.value })
            }
            variant="outlined"
            InputProps={{
              startAdornment: <Email className="mr-2 text-gray-400" />,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={currentStudent?.role || "student"}
              onChange={(e) =>
                setCurrentStudent({ ...currentStudent, role: e.target.value })
              }
              label="Role"
              startAdornment={<School className="mr-2 text-gray-400" />}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenEditStudentDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditStudent}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Lesson Assignment Dialog */}
      <Dialog
        open={openBulkLessonDialog}
        onClose={() => setOpenBulkLessonDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Assign Lesson to Students
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Lesson Title"
            fullWidth
            value={bulkLessonData.title}
            onChange={(e) =>
              setBulkLessonData({ ...bulkLessonData, title: e.target.value })
            }
            variant="outlined"
            InputProps={{
              startAdornment: <Book className="mr-2 text-gray-400" />,
            }}
          />
          <TextField
            label="Lesson Description"
            fullWidth
            multiline
            rows={3}
            value={bulkLessonData.description}
            onChange={(e) =>
              setBulkLessonData({
                ...bulkLessonData,
                description: e.target.value,
              })
            }
            variant="outlined"
          />
          <Typography variant="h6" className="font-semibold mt-4">
            Select Students
          </Typography>
          <Box className="max-h-60 overflow-y-auto">
            <Grid container spacing={2}>
              {students.map((student) => (
                <Grid item xs={12} sm={6} key={student.phone}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={bulkLessonData.selectedStudents.includes(
                          student.phone
                        )}
                        onChange={() => handleStudentSelection(student.phone)}
                      />
                    }
                    label={
                      <Box className="flex items-center space-x-2">
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" className="font-medium">
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {student.phone}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenBulkLessonDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkLessonAssignment}
            variant="contained"
            color="primary"
            disabled={bulkLessonData.selectedStudents.length === 0}
          >
            Assign to {bulkLessonData.selectedStudents.length} Students
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentManagementTab;
