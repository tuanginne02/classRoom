"use client";

import { useState } from "react";
import api from "../../services/api";
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
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  FormControlLabel,
  Checkbox,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Badge,
  LinearProgress,
  Avatar,
  Stack,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  School,
  Assignment,
  CheckCircleOutline,
  HourglassEmpty,
  ExpandMore,
  Delete,
  Edit,
  Add,
  Group,
  Book,
  TrendingUp,
  ViewList,
  ViewModule,
  Person,
  AccessTime,
  Star,
  Circle,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { format } from "date-fns";

function LessonManagementTab({ students, fetchStudents, setSnackbar }) {
  const [openAssignLessonDialog, setOpenAssignLessonDialog] = useState(false);
  const [lessonDetails, setLessonDetails] = useState({
    title: "",
    description: "",
    selectedStudents: [],
    deadline: null,
    descriptionFile: null,
  });
  const [openEditLessonDialog, setOpenEditLessonDialog] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [viewMode, setViewMode] = useState("cards");

  const handleAssignLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("title", lessonDetails.title);
      formData.append("description", lessonDetails.description);
      formData.append("deadline", lessonDetails.deadline);
      lessonDetails.selectedStudents.forEach((studentPhone) =>
        formData.append("studentPhones", studentPhone)
      );
      if (lessonDetails.descriptionFile) {
        formData.append("descriptionFile", lessonDetails.descriptionFile);
      }
      await api.post("/assignLessonBulk", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbar({
        open: true,
        message: `Lesson assigned to ${lessonDetails.selectedStudents.length} students successfully!`,
        severity: "success",
      });
      setOpenAssignLessonDialog(false);
      setLessonDetails({
        title: "",
        description: "",
        selectedStudents: [],
        deadline: null,
        descriptionFile: null,
      });
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

  const handleEditLesson = async () => {
    try {
      await api.put(
        `/editLesson/${currentStudent.phone}/${currentLesson.id}`,
        currentLesson
      );
      setSnackbar({
        open: true,
        message: "Lesson updated successfully!",
        severity: "success",
      });
      setOpenEditLessonDialog(false);
      setCurrentLesson(null);
      setCurrentStudent(null);
      fetchStudents();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update lesson.",
        severity: "error",
      });
    }
  };

  const handleDeleteLesson = async (studentPhone, lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await api.delete(`/lesson/${studentPhone}/${lessonId}`);
        setSnackbar({
          open: true,
          message: "Lesson deleted successfully!",
          severity: "success",
        });
        fetchStudents();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to delete lesson.",
          severity: "error",
        });
      }
    }
  };

  const handleStudentSelection = (studentPhone) => {
    setLessonDetails((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentPhone)
        ? prev.selectedStudents.filter((phone) => phone !== studentPhone)
        : [...prev.selectedStudents, studentPhone],
    }));
  };

  const getLessonStats = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    let pendingLessons = 0;

    students.forEach((student) => {
      if (student.lessons) {
        totalLessons += student.lessons.length;
        student.lessons.forEach((lesson) => {
          if (lesson.completed) {
            completedLessons++;
          } else {
            pendingLessons++;
          }
        });
      }
    });

    return { totalLessons, completedLessons, pendingLessons };
  };

  const getAllLessons = () => {
    const allLessons = [];
    students.forEach((student) => {
      if (student.lessons) {
        student.lessons.forEach((lesson) => {
          allLessons.push({
            ...lesson,
            studentName: student.name,
            studentPhone: student.phone,
            studentIsOnline: student.isOnline,
          });
        });
      }
    });
    return allLessons;
  };

  const stats = getLessonStats();
  const allLessons = getAllLessons();

  const renderLessonCard = (lesson) => {
    const isClosed =
      lesson.closed ||
      (lesson.deadline && new Date() > new Date(lesson.deadline));
    return (
      <Card
        key={`${lesson.studentPhone}-${lesson.id}`}
        elevation={2}
        className="rounded-xl hover:shadow-lg transition-all duration-300"
      >
        <CardContent className="p-6">
          <Box className="flex items-start justify-between mb-4">
            <Box className="flex items-center space-x-3">
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: lesson.completed
                    ? "success.main"
                    : isClosed
                    ? "error.main"
                    : "warning.main",
                }}
              >
                {lesson.completed ? <CheckCircleOutline /> : <HourglassEmpty />}
              </Avatar>
              <Box>
                <Typography variant="h6" className="font-semibold">
                  {lesson.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Assigned to {lesson.studentName}
                </Typography>
                {lesson.deadline && (
                  <Typography
                    variant="caption"
                    color={isClosed ? "error" : "textSecondary"}
                    sx={{ display: "block", mt: 1 }}
                  >
                    Deadline:{" "}
                    {format(new Date(lesson.deadline), "dd/MM/yyyy HH:mm")}
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
              </Box>
            </Box>
            <Chip
              label={
                lesson.completed ? "Completed" : isClosed ? "Closed" : "Pending"
              }
              color={
                lesson.completed ? "success" : isClosed ? "error" : "warning"
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
              size="small"
            />
          </Box>
          <Typography variant="body2" color="textSecondary" className="mb-4">
            {lesson.description}
          </Typography>
          <Box className="flex items-center justify-between">
            <Box className="flex items-center space-x-2">
              <Circle
                fontSize="small"
                className={
                  lesson.studentIsOnline ? "text-green-500" : "text-gray-400"
                }
              />
              <Typography variant="caption" color="textSecondary">
                {lesson.studentIsOnline ? "Student Online" : "Student Offline"}
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary">
              ID: {lesson.id}
            </Typography>
          </Box>
        </CardContent>
        <CardActions className="p-4 pt-0">
          <Stack direction="row" spacing={1} className="w-full">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={() => {
                setCurrentLesson(lesson);
                setCurrentStudent({
                  phone: lesson.studentPhone,
                  name: lesson.studentName,
                });
                setOpenEditLessonDialog(true);
              }}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Delete />}
              onClick={() => handleDeleteLesson(lesson.studentPhone, lesson.id)}
              className="flex-1"
            >
              Delete
            </Button>
          </Stack>
        </CardActions>
      </Card>
    );
  };

  const renderLessonTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Lesson</TableCell>
            <TableCell className="font-semibold">Student</TableCell>
            <TableCell className="font-semibold">Status</TableCell>
            <TableCell className="font-semibold">Deadline</TableCell>
            <TableCell className="font-semibold">Description File</TableCell>
            <TableCell className="font-semibold">Student Status</TableCell>
            <TableCell className="font-semibold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allLessons.map((lesson) => {
            const isClosed =
              lesson.closed ||
              (lesson.deadline && new Date() > new Date(lesson.deadline));
            return (
              <TableRow
                key={`${lesson.studentPhone}-${lesson.id}`}
                className="hover:bg-gray-50"
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" className="font-medium">
                      {lesson.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {lesson.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box className="flex items-center space-x-2">
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="body2">
                      {lesson.studentName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
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
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {lesson.deadline
                    ? format(new Date(lesson.deadline), "dd/MM/yyyy HH:mm")
                    : "-"}
                </TableCell>
                <TableCell>
                  {lesson.descriptionFile ? (
                    <Button
                      size="small"
                      variant="outlined"
                      href={`http://localhost:3001/download-description/${lesson.descriptionFile}`}
                      target="_blank"
                    >
                      Download
                    </Button>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Box className="flex items-center space-x-1">
                    <Circle
                      fontSize="small"
                      className={
                        lesson.studentIsOnline
                          ? "text-green-500"
                          : "text-gray-400"
                      }
                    />
                    <Typography variant="body2">
                      {lesson.studentIsOnline ? "Online" : "Offline"}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setCurrentStudent({
                          phone: lesson.studentPhone,
                          name: lesson.studentName,
                        });
                        setOpenEditLessonDialog(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleDeleteLesson(lesson.studentPhone, lesson.id)
                      }
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
            Lesson Management
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
              onClick={() => setOpenAssignLessonDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Assign New Lesson
            </Button>
          </Stack>
        </Box>

        <Typography variant="body1" color="textSecondary" className="mb-6">
          Create, assign, and manage lessons for your students efficiently.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={4}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <Book />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {stats.totalLessons}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Lessons
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <CheckCircleOutline />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {stats.completedLessons}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                  <HourglassEmpty />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {stats.pendingLessons}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lessons List */}
      {allLessons.length === 0 ? (
        <Card elevation={2} className="rounded-xl">
          <CardContent className="text-center py-12">
            <Book sx={{ fontSize: 80, color: "text.secondary", mb: 3 }} />
            <Typography variant="h5" color="textSecondary" className="mb-2">
              No lessons assigned yet
            </Typography>
            <Typography variant="body1" color="textSecondary" className="mb-4">
              Start by assigning your first lesson to students.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAssignLessonDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Assign First Lesson
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        <Grid container spacing={3}>
          {allLessons.map(renderLessonCard)}
        </Grid>
      ) : (
        renderLessonTable()
      )}

      {/* Assign Lesson Dialog */}
      <Dialog
        open={openAssignLessonDialog}
        onClose={() => setOpenAssignLessonDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-green-700 font-bold">
          Assign New Lesson
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Lesson Title"
            fullWidth
            value={lessonDetails.title}
            onChange={(e) =>
              setLessonDetails({ ...lessonDetails, title: e.target.value })
            }
            variant="outlined"
            InputProps={{
              startAdornment: <Book className="mr-2 text-gray-400" />,
            }}
          />
          <TextField
            label="Lesson Description (optional)"
            fullWidth
            multiline
            rows={3}
            value={lessonDetails.description}
            onChange={(e) =>
              setLessonDetails({
                ...lessonDetails,
                description: e.target.value,
              })
            }
            variant="outlined"
          />
          <Button variant="outlined" component="label" sx={{ mt: 1, mb: 1 }}>
            Upload Description File
            <input
              type="file"
              hidden
              onChange={(e) =>
                setLessonDetails({
                  ...lessonDetails,
                  descriptionFile: e.target.files[0],
                })
              }
            />
          </Button>
          {lessonDetails.descriptionFile && (
            <Typography variant="caption">
              {lessonDetails.descriptionFile.name}
            </Typography>
          )}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Deadline"
              value={
                lessonDetails.deadline ? new Date(lessonDetails.deadline) : null
              }
              onChange={(date) =>
                setLessonDetails({
                  ...lessonDetails,
                  deadline: date ? date.toISOString() : null,
                })
              }
              slotProps={{
                textField: { fullWidth: true, margin: "normal" },
              }}
            />
          </LocalizationProvider>
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
                        checked={lessonDetails.selectedStudents.includes(
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
            onClick={() => setOpenAssignLessonDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignLesson}
            variant="contained"
            color="primary"
            disabled={lessonDetails.selectedStudents.length === 0}
          >
            Assign to {lessonDetails.selectedStudents.length} Students
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lesson Dialog */}
      <Dialog
        open={openEditLessonDialog}
        onClose={() => setOpenEditLessonDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Edit Lesson
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Lesson Title"
            fullWidth
            value={currentLesson?.title || ""}
            onChange={(e) =>
              setCurrentLesson({ ...currentLesson, title: e.target.value })
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
            value={currentLesson?.description || ""}
            onChange={(e) =>
              setCurrentLesson({
                ...currentLesson,
                description: e.target.value,
              })
            }
            variant="outlined"
          />
          <Box className="bg-gray-50 p-3 rounded-lg">
            <Typography variant="body2" color="textSecondary">
              Assigned to: {currentStudent?.name}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenEditLessonDialog(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditLesson}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LessonManagementTab;
