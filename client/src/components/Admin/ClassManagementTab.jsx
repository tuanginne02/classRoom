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
  Schedule,
  LocationOn,
  Subject,
  Grade,
} from "@mui/icons-material";

// Mock data for demonstration
const mockClasses = [
  {
    id: 1,
    name: "Lớp Toán 10A",
    subject: "Toán học",
    teacher: "Trần Thị B",
    teacherEmail: "tranthib@example.com",
    status: "active",
    createdAt: "2024-01-15",
    startDate: "2024-01-20",
    endDate: "2024-06-30",
    totalStudents: 25,
    maxStudents: 30,
    currentLesson: "Chương 3: Hàm số bậc hai",
    completedLessons: 8,
    totalLessons: 15,
    rating: 4.5,
    description: "Lớp học Toán nâng cao cho học sinh lớp 10",
    schedule: "Thứ 2, 4, 6 - 19:00-20:30",
    location: "Phòng học 101",
    grade: "10",
  },
  {
    id: 2,
    name: "Lớp Vật lý 11B",
    subject: "Vật lý",
    teacher: "Hoàng Văn E",
    teacherEmail: "hoangvane@example.com",
    status: "active",
    createdAt: "2024-01-10",
    startDate: "2024-01-18",
    endDate: "2024-07-15",
    totalStudents: 18,
    maxStudents: 25,
    currentLesson: "Chương 2: Điện trường",
    completedLessons: 5,
    totalLessons: 12,
    rating: 4.8,
    description: "Lớp học Vật lý cơ bản cho học sinh lớp 11",
    schedule: "Thứ 3, 5, 7 - 18:00-19:30",
    location: "Phòng thí nghiệm 2",
    grade: "11",
  },
  {
    id: 3,
    name: "Lớp Hóa học 12C",
    subject: "Hóa học",
    teacher: "Lê Thị F",
    teacherEmail: "lethif@example.com",
    status: "completed",
    createdAt: "2023-09-01",
    startDate: "2023-09-15",
    endDate: "2024-01-15",
    totalStudents: 22,
    maxStudents: 25,
    currentLesson: "Đã hoàn thành",
    completedLessons: 20,
    totalLessons: 20,
    rating: 4.2,
    description: "Lớp học Hóa học nâng cao cho học sinh lớp 12",
    schedule: "Thứ 2, 4, 6 - 20:00-21:30",
    location: "Phòng thí nghiệm 1",
    grade: "12",
  },
  {
    id: 4,
    name: "Lớp Tiếng Anh 9A",
    subject: "Tiếng Anh",
    teacher: "Nguyễn Văn G",
    teacherEmail: "nguyenvang@example.com",
    status: "active",
    createdAt: "2024-01-05",
    startDate: "2024-01-12",
    endDate: "2024-05-30",
    totalStudents: 15,
    maxStudents: 20,
    currentLesson: "Unit 3: Communication",
    completedLessons: 3,
    totalLessons: 10,
    rating: 4.6,
    description: "Lớp học Tiếng Anh giao tiếp cho học sinh lớp 9",
    schedule: "Thứ 3, 5 - 17:00-18:30",
    location: "Phòng học 203",
    grade: "9",
  },
];

const subjects = [
  "Toán học",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Tiếng Anh",
  "Văn học",
  "Lịch sử",
  "Địa lý",
  "Tin học",
  "Thể dục",
];

const grades = ["6", "7", "8", "9", "10", "11", "12"];

const statuses = [
  { value: "active", label: "Đang hoạt động", color: "success" },
  { value: "completed", label: "Đã kết thúc", color: "info" },
  { value: "suspended", label: "Tạm ngưng", color: "warning" },
  { value: "cancelled", label: "Đã hủy", color: "error" },
];

function ClassManagementTab() {
  const [classes, setClasses] = useState(mockClasses);
  const [filteredClasses, setFilteredClasses] = useState(mockClasses);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedClass, setSelectedClass] = useState(null);
  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [openAddClassDialog, setOpenAddClassDialog] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    subject: "",
    teacher: "",
    teacherEmail: "",
    description: "",
    schedule: "",
    location: "",
    grade: "",
    maxStudents: 30,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter classes based on search and filters
  useEffect(() => {
    let filtered = classes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (cls) =>
          cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((cls) => cls.subject === subjectFilter);
    }

    // Grade filter
    if (gradeFilter !== "all") {
      filtered = filtered.filter((cls) => cls.grade === gradeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((cls) => cls.status === statusFilter);
    }

    setFilteredClasses(filtered);
  }, [classes, searchTerm, subjectFilter, gradeFilter, statusFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubjectFilterChange = (event) => {
    setSubjectFilter(event.target.value);
  };

  const handleGradeFilterChange = (event) => {
    setGradeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleClassClick = (cls) => {
    setSelectedClass(cls);
    setOpenClassDialog(true);
  };

  const handleEditClass = (cls) => {
    setSelectedClass(cls);
    setOpenClassDialog(true);
  };

  const handleSaveClass = () => {
    if (selectedClass) {
      setClasses(
        classes.map((cls) =>
          cls.id === selectedClass.id ? selectedClass : cls
        )
      );
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin lớp học thành công!",
        severity: "success",
      });
      setOpenClassDialog(false);
      setSelectedClass(null);
    }
  };

  const handleAddClass = () => {
    const newClassWithId = {
      ...newClass,
      id: Date.now(),
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      totalStudents: 0,
      currentLesson: "Chương 1: Giới thiệu",
      completedLessons: 0,
      totalLessons: 15,
      rating: 0,
    };
    setClasses([...classes, newClassWithId]);
    setNewClass({
      name: "",
      subject: "",
      teacher: "",
      teacherEmail: "",
      description: "",
      schedule: "",
      location: "",
      grade: "",
      maxStudents: 30,
    });
    setOpenAddClassDialog(false);
    setSnackbar({
      open: true,
      message: "Thêm lớp học mới thành công!",
      severity: "success",
    });
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lớp học này?")) {
      setClasses(classes.filter((cls) => cls.id !== classId));
      setSnackbar({
        open: true,
        message: "Xóa lớp học thành công!",
        severity: "success",
      });
    }
  };

  const getStatusColor = (status) => {
    return statuses.find((s) => s.value === status)?.color || "default";
  };

  const getStatusLabel = (status) => {
    return statuses.find((s) => s.value === status)?.label || status;
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const renderClassTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Lớp học</TableCell>
            <TableCell className="font-semibold">Giáo viên</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Học sinh</TableCell>
            <TableCell className="font-semibold">Tiến độ</TableCell>
            <TableCell className="font-semibold">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredClasses.map((cls) => (
            <TableRow key={cls.id} className="hover:bg-gray-50">
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Avatar
                    sx={{ width: 40, height: 40, bgcolor: "primary.main" }}
                  >
                    <Class />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="font-medium">
                      {cls.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {cls.subject} - Lớp {cls.grade}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{cls.teacher}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {cls.teacherEmail}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(cls.status)}
                  color={getStatusColor(cls.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {cls.totalStudents}/{cls.maxStudents}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {Math.round((cls.totalStudents / cls.maxStudents) * 100)}% đầy
                </Typography>
              </TableCell>
              <TableCell>
                <Box className="w-24">
                  <Typography variant="body2">
                    {getProgressPercentage(
                      cls.completedLessons,
                      cls.totalLessons
                    )}
                    %
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(
                      cls.completedLessons,
                      cls.totalLessons
                    )}
                    sx={{ height: 6, borderRadius: 3 }}
                    color="primary"
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => handleClassClick(cls)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClass(cls)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClass(cls.id)}
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

  const renderClassCards = () => (
    <Grid container spacing={3}>
      {filteredClasses.map((cls) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={cls.id}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <Box className="flex items-start justify-between mb-3">
                <Box className="flex items-center space-x-3">
                  <Avatar
                    sx={{ width: 48, height: 48, bgcolor: "primary.main" }}
                  >
                    <Class />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="font-semibold">
                      {cls.name}
                    </Typography>
                    <Chip
                      label={getStatusLabel(cls.status)}
                      color={getStatusColor(cls.status)}
                      size="small"
                      className="mt-1"
                    />
                  </Box>
                </Box>
              </Box>

              <Stack spacing={1} className="mb-3">
                <Box className="flex items-center space-x-2">
                  <Subject fontSize="small" color="action" />
                  <Typography variant="body2">
                    {cls.subject} - Lớp {cls.grade}
                  </Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2">{cls.teacher}</Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Schedule fontSize="small" color="action" />
                  <Typography variant="body2">{cls.schedule}</Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <LocationOn fontSize="small" color="action" />
                  <Typography variant="body2">{cls.location}</Typography>
                </Box>
              </Stack>

              <Divider className="my-2" />

              <Grid container spacing={2} className="mb-3">
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Học sinh
                  </Typography>
                  <Typography variant="h6" className="font-bold text-blue-600">
                    {cls.totalStudents}/{cls.maxStudents}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Tiến độ
                  </Typography>
                  <Typography variant="h6" className="font-bold text-green-600">
                    {getProgressPercentage(
                      cls.completedLessons,
                      cls.totalLessons
                    )}
                    %
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(
                      cls.completedLessons,
                      cls.totalLessons
                    )}
                    sx={{ height: 6, borderRadius: 3 }}
                    color="primary"
                  />
                </Grid>
              </Grid>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleClassClick(cls)}
                  fullWidth
                >
                  Chi tiết
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEditClass(cls)}
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
          Quản lý lớp học
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý tất cả lớp học trong hệ thống, xem thông tin chi tiết và tiến
          độ học tập
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
                <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                  <Class />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {classes.filter((c) => c.status === "active").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Lớp đang hoạt động
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
                <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {classes.reduce((sum, c) => sum + c.totalStudents, 0)}
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
                <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {new Set(classes.map((c) => c.teacher)).size}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giáo viên tham gia
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
                    {(
                      classes.reduce((sum, c) => sum + c.rating, 0) /
                      classes.length
                    ).toFixed(1)}
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên lớp, giáo viên, môn học..."
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
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Môn học</InputLabel>
                <Select
                  value={subjectFilter}
                  onChange={handleSubjectFilterChange}
                  label="Môn học"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Lớp</InputLabel>
                <Select
                  value={gradeFilter}
                  onChange={handleGradeFilterChange}
                  label="Lớp"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      Lớp {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={3}>
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
                  onClick={() => setOpenAddClassDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm lớp học
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box className="mb-4">
        <Typography variant="body2" color="textSecondary">
          Hiển thị {filteredClasses.length} trong tổng số {classes.length} lớp
          học
        </Typography>
      </Box>

      {/* Class List */}
      {viewMode === "table" ? renderClassTable() : renderClassCards()}

      {/* Class Detail Dialog */}
      <Dialog
        open={openClassDialog}
        onClose={() => setOpenClassDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết lớp học
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedClass && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tên lớp"
                  fullWidth
                  value={selectedClass.name}
                  onChange={(e) =>
                    setSelectedClass({ ...selectedClass, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Môn học"
                  fullWidth
                  value={selectedClass.subject}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      subject: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Giáo viên"
                  fullWidth
                  value={selectedClass.teacher}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      teacher: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email giáo viên"
                  fullWidth
                  value={selectedClass.teacherEmail}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      teacherEmail: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lịch học"
                  fullWidth
                  value={selectedClass.schedule}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      schedule: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Địa điểm"
                  fullWidth
                  value={selectedClass.location}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      location: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lớp"
                  fullWidth
                  value={selectedClass.grade}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      grade: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số học sinh tối đa"
                  fullWidth
                  type="number"
                  value={selectedClass.maxStudents}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      maxStudents: parseInt(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={3}
                  value={selectedClass.description}
                  onChange={(e) =>
                    setSelectedClass({
                      ...selectedClass,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenClassDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveClass} variant="contained" color="primary">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog
        open={openAddClassDialog}
        onClose={() => setOpenAddClassDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Thêm lớp học mới
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Tên lớp"
            fullWidth
            value={newClass.name}
            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
          />
          <TextField
            label="Môn học"
            fullWidth
            value={newClass.subject}
            onChange={(e) =>
              setNewClass({ ...newClass, subject: e.target.value })
            }
          />
          <TextField
            label="Giáo viên"
            fullWidth
            value={newClass.teacher}
            onChange={(e) =>
              setNewClass({ ...newClass, teacher: e.target.value })
            }
          />
          <TextField
            label="Email giáo viên"
            fullWidth
            value={newClass.teacherEmail}
            onChange={(e) =>
              setNewClass({ ...newClass, teacherEmail: e.target.value })
            }
          />
          <TextField
            label="Lịch học"
            fullWidth
            value={newClass.schedule}
            onChange={(e) =>
              setNewClass({ ...newClass, schedule: e.target.value })
            }
          />
          <TextField
            label="Địa điểm"
            fullWidth
            value={newClass.location}
            onChange={(e) =>
              setNewClass({ ...newClass, location: e.target.value })
            }
          />
          <TextField
            label="Lớp"
            fullWidth
            value={newClass.grade}
            onChange={(e) =>
              setNewClass({ ...newClass, grade: e.target.value })
            }
          />
          <TextField
            label="Số học sinh tối đa"
            fullWidth
            type="number"
            value={newClass.maxStudents}
            onChange={(e) =>
              setNewClass({
                ...newClass,
                maxStudents: parseInt(e.target.value),
              })
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={newClass.description}
            onChange={(e) =>
              setNewClass({ ...newClass, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenAddClassDialog(false)}
            color="secondary"
          >
            Hủy
          </Button>
          <Button onClick={handleAddClass} variant="contained" color="primary">
            Thêm lớp học
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

export default ClassManagementTab;
