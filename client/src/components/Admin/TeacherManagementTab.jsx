"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Person,
  School,
  Group,
  Book,
  Message,
  Email,
  Phone,
  CalendarToday,
  AccessTime,
  MoreVert,
  Refresh,
  Download,
  ViewList,
  ViewModule,
  Sort,
  FilterAlt,
  Clear,
  Check,
  Close as CloseIcon,
  Info,
  Error,
  // Success,
  Warning,
  Assignment,
  History,
  Timeline,
  BarChart,
  PieChart,
  TableChart,
  Class,
  People,
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Pause,
  PlayArrow,
  Stop,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  fetchInstructors,
  addInstructor,
  editInstructor,
  deleteInstructor,
  toggleInstructorStatus,
  toggleInstructorClassCreation,
} from "../../services/instructor";

const statuses = [
  { value: "active", label: "Hoạt động", color: "success" },
  { value: "suspended", label: "Tạm ngưng", color: "warning" },
  { value: "banned", label: "Bị cấm", color: "error" },
];

// Hàm kiểm tra số điện thoại hợp lệ (10 số, bắt đầu bằng 0)
function isValidPhoneNumber(phone) {
  return /^0[0-9]{9}$/.test(phone);
}

// Hàm tạo classroomId ngẫu nhiên
function generateClassroomId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function TeacherManagementTab() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [openAddTeacherDialog, setOpenAddTeacherDialog] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    classroomId: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch teachers from API
  const loadTeachers = async () => {
    try {
      const data = await fetchInstructors();
      setTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
      setSnackbar({
        open: true,
        message: "Lỗi tải danh sách giáo viên!",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Filter teachers based on search and filters
  useEffect(() => {
    let filtered = teachers;
    if (searchTerm) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.phone.includes(searchTerm) ||
          (teacher.subjects || []).some((subject) =>
            subject.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((teacher) => teacher.status === statusFilter);
    }
    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, statusFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenTeacherDialog(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setOpenTeacherDialog(true);
  };

  const handleSaveTeacher = async () => {
    if (selectedTeacher) {
      try {
        await editInstructor(selectedTeacher.phone, selectedTeacher);
        setSnackbar({
          open: true,
          message: "Cập nhật thông tin giáo viên thành công!",
          severity: "success",
        });
        setOpenTeacherDialog(false);
        setSelectedTeacher(null);
        await loadTeachers();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Lỗi cập nhật giáo viên!",
          severity: "error",
        });
      }
    }
  };

  const handleAddTeacher = async () => {
    if (!isValidPhoneNumber(newTeacher.phone)) {
      setSnackbar({
        open: true,
        message:
          "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số, bắt đầu bằng 0.",
        severity: "error",
      });
      return;
    }
    try {
      // Tạo classroomId ngẫu nhiên và đảm bảo các trường phụ luôn có
      const teacherData = {
        ...newTeacher,
        classroomId: generateClassroomId(),
        subjects: [],
        experience: "",
        education: "",
      };

      const response = await addInstructor(teacherData);
      setSnackbar({
        open: true,
        message: `Thêm giáo viên mới thành công! Classroom ID: ${response.classroomId}`,
        severity: "success",
      });
      setOpenAddTeacherDialog(false);
      setNewTeacher({
        name: "",
        email: "",
        phone: "",
        classroomId: "",
      });
      await loadTeachers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Lỗi thêm giáo viên!",
        severity: "error",
      });
    }
  };

  const handleToggleTeacherStatus = async (teacherId) => {
    try {
      await toggleInstructorStatus(teacherId);
      setSnackbar({
        open: true,
        message: "Cập nhật trạng thái giáo viên thành công!",
        severity: "success",
      });
      await loadTeachers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Lỗi cập nhật trạng thái!",
        severity: "error",
      });
    }
  };

  const handleToggleClassCreation = async (teacherId) => {
    try {
      await toggleInstructorClassCreation(teacherId);
      setSnackbar({
        open: true,
        message: "Cập nhật quyền tạo lớp thành công!",
        severity: "success",
      });
      await loadTeachers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Lỗi cập nhật quyền!",
        severity: "error",
      });
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      try {
        await deleteInstructor(teacherId);
        setSnackbar({
          open: true,
          message: "Xóa giáo viên thành công!",
          severity: "success",
        });
        await loadTeachers();
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Lỗi xóa giáo viên!",
          severity: "error",
        });
      }
    }
  };

  const getStatusColor = (status) => {
    return statuses.find((s) => s.value === status)?.color || "default";
  };

  const getStatusLabel = (status) => {
    return statuses.find((s) => s.value === status)?.label || status;
  };

  const renderTeacherTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Giáo viên</TableCell>
            <TableCell className="font-semibold">Liên hệ</TableCell>
            <TableCell className="font-semibold">Classroom ID</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Thống kê lớp học</TableCell>
            <TableCell className="font-semibold">Đánh giá</TableCell>
            <TableCell className="font-semibold">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTeachers.map((teacher) => (
            <TableRow key={teacher.phone} className="hover:bg-gray-50">
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <School />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="font-medium">
                      {teacher.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {Array.isArray(teacher.subjects)
                        ? teacher.subjects.join(", ")
                        : ""}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{teacher.email}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {teacher.phone}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={teacher.classroomId || "N/A"}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Chip
                    label={getStatusLabel(teacher.status)}
                    color={getStatusColor(teacher.status)}
                    size="small"
                  />
                  <Box
                    className={`w-2 h-2 rounded-full ${
                      teacher.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {teacher.activeClasses}/{teacher.totalClasses} lớp đang dạy
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {teacher.totalStudents} học sinh
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="flex items-center space-x-1">
                  <Star sx={{ color: "gold", fontSize: 16 }} />
                  <Typography variant="body2">{teacher.rating}</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {teacher.completedLessons} bài giảng
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => handleTeacherClick(teacher)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      teacher.canCreateClasses
                        ? "Thu hồi quyền tạo lớp"
                        : "Cấp quyền tạo lớp"
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleToggleClassCreation(teacher.phone)}
                      color={teacher.canCreateClasses ? "warning" : "success"}
                    >
                      {teacher.canCreateClasses ? <Pause /> : <PlayArrow />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      teacher.status === "active" ? "Tạm ngưng" : "Kích hoạt"
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleToggleTeacherStatus(teacher.phone)}
                      color={
                        teacher.status === "active" ? "warning" : "success"
                      }
                    >
                      {teacher.status === "active" ? <Stop /> : <PlayArrow />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTeacher(teacher.phone)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTeacherCards = () => (
    <Grid container spacing={3}>
      {filteredTeachers.map((teacher) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={teacher.phone}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <Box className="flex items-start justify-between mb-3">
                <Box className="flex items-center space-x-3">
                  <Avatar
                    sx={{ width: 48, height: 48, bgcolor: "success.main" }}
                  >
                    <School />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="font-semibold">
                      {teacher.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(teacher.status)}
                      color={getStatusColor(teacher.status)}
                      size="small"
                      className="mt-1"
                    />
                  </Box>
                </Box>
                <Box
                  className={`w-3 h-3 rounded-full ${
                    teacher.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </Box>

              <Stack spacing={1} className="mb-3">
                <Box className="flex items-center space-x-2">
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" className="truncate">
                    {teacher.email}
                  </Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{teacher.phone}</Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Book fontSize="small" color="action" />
                  <Typography variant="body2">
                    {Array.isArray(teacher.subjects)
                      ? teacher.subjects.join(", ")
                      : ""}
                  </Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Class fontSize="small" color="action" />
                  <Typography variant="body2">
                    ID: {teacher.classroomId || "N/A"}
                  </Typography>
                </Box>
              </Stack>

              <Divider className="my-2" />

              <Grid container spacing={2} className="mb-3">
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Lớp đang dạy
                  </Typography>
                  <Typography variant="h6" className="font-bold text-blue-600">
                    {teacher.activeClasses}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Học sinh
                  </Typography>
                  <Typography variant="h6" className="font-bold text-green-600">
                    {teacher.totalStudents}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Đánh giá
                  </Typography>
                  <Box className="flex items-center space-x-1">
                    <Star sx={{ color: "gold", fontSize: 16 }} />
                    <Typography variant="body2" className="font-medium">
                      {teacher.rating}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Bài giảng
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    {teacher.completedLessons}
                  </Typography>
                </Grid>
              </Grid>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleTeacherClick(teacher)}
                  fullWidth
                >
                  Chi tiết
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEditTeacher(teacher)}
                  fullWidth
                >
                  Sửa
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box>
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Quản lý giáo viên
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý tất cả giáo viên, xem thống kê lớp học và quyền tạo lớp
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} className="mb-6">
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {teachers.filter((t) => t.status === "active").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giáo viên hoạt động
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <Class />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {teachers.reduce(
                      (sum, t) => sum + (t.activeClasses ?? 0),
                      0
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Lớp đang dạy
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {(teachers.reduce((sum, t) => sum + t.totalStudents, 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tổng học sinh
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "info.main", width: 56, height: 56 }}>
                  <Star />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {teachers.length > 0
                      ? (
                          teachers.reduce(
                            (sum, t) => sum + (t.rating ?? 0),
                            0
                          ) / teachers.length
                        ).toFixed(1)
                      : "0.0"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Đánh giá trung bình
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Actions */}
      <Card elevation={2} className="rounded-xl mb-6">
        <CardContent className="p-6">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên, email, môn học..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Trạng thái"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                >
                  <ToggleButton value="table">
                    <ViewList />
                  </ToggleButton>
                  <ToggleButton value="cards">
                    <ViewModule />
                  </ToggleButton>
                </ToggleButtonGroup>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenAddTeacherDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm giáo viên
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box className="mb-4">
        <Typography variant="body2" color="textSecondary">
          Hiển thị {filteredTeachers.length} trong tổng số {teachers.length}{" "}
          giáo viên
        </Typography>
      </Box>

      {/* Teacher List */}
      {viewMode === "table" ? renderTeacherTable() : renderTeacherCards()}

      {/* Teacher Detail Dialog */}
      <Dialog
        open={openTeacherDialog}
        onClose={() => setOpenTeacherDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết giáo viên
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedTeacher && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Họ tên"
                  fullWidth
                  value={selectedTeacher.name}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={selectedTeacher.email}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      email: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={selectedTeacher.phone}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      phone: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Classroom ID"
                  fullWidth
                  value={selectedTeacher.classroomId || ""}
                  disabled
                  helperText="ID được tạo tự động"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Môn học"
                  fullWidth
                  value={
                    Array.isArray(selectedTeacher.subjects)
                      ? selectedTeacher.subjects.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      subjects: e.target.value.split(", "),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Kinh nghiệm"
                  fullWidth
                  value={selectedTeacher.experience}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      experience: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Học vị"
                  fullWidth
                  value={selectedTeacher.education}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      education: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedTeacher.canCreateClasses}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          canCreateClasses: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Quyền tạo lớp"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedTeacher.isOnline}
                      onChange={(e) =>
                        setSelectedTeacher({
                          ...selectedTeacher,
                          isOnline: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Trạng thái online"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenTeacherDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSaveTeacher}
            variant="contained"
            color="primary"
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Teacher Dialog */}
      <Dialog
        open={openAddTeacherDialog}
        onClose={() => setOpenAddTeacherDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Thêm giáo viên mới
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Họ tên"
            fullWidth
            value={newTeacher.name}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, name: e.target.value })
            }
            required
            helperText="Nhập họ tên đầy đủ của giáo viên"
          />
          <TextField
            label="Email"
            fullWidth
            value={newTeacher.email}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, email: e.target.value })
            }
            required
            type="email"
            helperText="Nhập email hợp lệ"
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            value={newTeacher.phone}
            onChange={(e) =>
              setNewTeacher({ ...newTeacher, phone: e.target.value })
            }
            required
            error={
              newTeacher.phone !== "" && !isValidPhoneNumber(newTeacher.phone)
            }
            helperText={
              newTeacher.phone !== "" && !isValidPhoneNumber(newTeacher.phone)
                ? "Số điện thoại phải gồm 10 số, bắt đầu bằng 0"
                : "Nhập số điện thoại 10 số, bắt đầu bằng 0"
            }
          />
          <Box className="p-4 bg-blue-50 rounded-lg">
            <Typography variant="body2" className="text-blue-700 mb-2">
              <strong>Lưu ý:</strong>
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              • Classroom ID sẽ được tạo tự động ngẫu nhiên
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              • Mật khẩu sẽ được gửi qua email cho giáo viên
            </Typography>
            <Typography variant="body2" className="text-blue-600">
              • Giáo viên có thể đăng nhập bằng số điện thoại và mật khẩu
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenAddTeacherDialog(false)}
            color="secondary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddTeacher}
            variant="contained"
            color="primary"
            disabled={
              !newTeacher.name.trim() ||
              !newTeacher.email.trim() ||
              !isValidPhoneNumber(newTeacher.phone)
            }
          >
            Thêm giáo viên
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TeacherManagementTab;
