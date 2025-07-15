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
  Analytics,
  Assessment,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed,
  Timer,
  Schedule,
  Event,
  Notifications,
  Report,
  Flag,
  PriorityHigh,
} from "@mui/icons-material";

// Mock data for demonstration
const mockStatistics = {
  totalUsers: 1234,
  activeStudents: 987,
  activeTeachers: 45,
  openClasses: 156,
  averageActivityTime: 2.5,
  reportedUsers: 12,
  systemUptime: 99.8,
  monthlyGrowth: 15.2,
  completionRate: 87.3,
  satisfactionScore: 4.6,
};

const mockReportedUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    role: "student",
    reportCount: 3,
    lastReport: "2024-01-20 14:30",
    reason: "Spam tin nhắn",
    status: "pending",
    severity: "medium",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    role: "teacher",
    reportCount: 1,
    lastReport: "2024-01-19 16:45",
    reason: "Nội dung không phù hợp",
    status: "reviewed",
    severity: "low",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0111222333",
    role: "student",
    reportCount: 5,
    lastReport: "2024-01-20 10:15",
    reason: "Quấy rối người dùng khác",
    status: "pending",
    severity: "high",
  },
];

const mockActivityData = [
  { month: "T1", users: 1200, classes: 140, growth: 12 },
  { month: "T2", users: 1250, classes: 145, growth: 15 },
  { month: "T3", users: 1300, classes: 150, growth: 18 },
  { month: "T4", users: 1350, classes: 155, growth: 20 },
  { month: "T5", users: 1400, classes: 160, growth: 22 },
  { month: "T6", users: 1450, classes: 165, growth: 25 },
];

function StatisticsTab() {
  const [statistics, setStatistics] = useState(mockStatistics);
  const [reportedUsers, setReportedUsers] = useState(mockReportedUsers);
  const [activityData, setActivityData] = useState(mockActivityData);
  const [selectedTimeRange, setSelectedTimeRange] = useState("month");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setSelectedTimeRange(newRange);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleUpdateUserStatus = (userId, status) => {
    setReportedUsers(
      reportedUsers.map((user) =>
        user.id === userId ? { ...user, status } : user
      )
    );
    setSnackbar({
      open: true,
      message: "Cập nhật trạng thái người dùng thành công!",
      severity: "success",
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "reviewed":
        return "success";
      case "resolved":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "reviewed":
        return "Đã xem xét";
      case "resolved":
        return "Đã giải quyết";
      default:
        return status;
    }
  };

  const renderStatisticsCards = () => (
    <Grid container spacing={3} className="mb-6">
      <Grid item xs={12} sm={6} md={3}>
        <Card
          elevation={2}
          className="rounded-xl hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-6">
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                <People />
              </Avatar>
              <Box>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.totalUsers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tổng người dùng
                </Typography>
                <Typography variant="caption" color="success.main">
                  +{statistics.monthlyGrowth}% so với tháng trước
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
                <School />
              </Avatar>
              <Box>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.activeTeachers}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Giáo viên hoạt động
                </Typography>
                <Typography variant="caption" color="success.main">
                  {statistics.activeStudents} học sinh
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
                <Class />
              </Avatar>
              <Box>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.openClasses}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Lớp học đang mở
                </Typography>
                <Typography variant="caption" color="success.main">
                  {statistics.completionRate}% hoàn thành
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
                <Timer />
              </Avatar>
              <Box>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {statistics.averageActivityTime}h
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Thời gian hoạt động TB
                </Typography>
                <Typography variant="caption" color="success.main">
                  {statistics.systemUptime}% uptime
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderActivityChart = () => (
    <Card elevation={2} className="rounded-xl mb-6">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-bold">
            Tăng trưởng theo thời gian
          </Typography>
          <ToggleButtonGroup
            value={selectedTimeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
          >
            <ToggleButton value="week">Tuần</ToggleButton>
            <ToggleButton value="month">Tháng</ToggleButton>
            <ToggleButton value="quarter">Quý</ToggleButton>
            <ToggleButton value="year">Năm</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className="font-semibold mb-2">
              Người dùng mới
            </Typography>
            <Box className="space-y-2">
              {activityData.map((data, index) => (
                <Box key={index} className="flex items-center justify-between">
                  <Typography variant="body2">{data.month}</Typography>
                  <Box className="flex items-center space-x-2">
                    <Typography variant="body2" className="font-medium">
                      {data.users}
                    </Typography>
                    <Box className="w-20">
                      <LinearProgress
                        variant="determinate"
                        value={(data.users / 1500) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                        color="primary"
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className="font-semibold mb-2">
              Lớp học mới
            </Typography>
            <Box className="space-y-2">
              {activityData.map((data, index) => (
                <Box key={index} className="flex items-center justify-between">
                  <Typography variant="body2">{data.month}</Typography>
                  <Box className="flex items-center space-x-2">
                    <Typography variant="body2" className="font-medium">
                      {data.classes}
                    </Typography>
                    <Box className="w-20">
                      <LinearProgress
                        variant="determinate"
                        value={(data.classes / 200) * 100}
                        sx={{ height: 6, borderRadius: 3 }}
                        color="success"
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderReportedUsers = () => (
    <Card elevation={2} className="rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-bold">
            Người dùng bị báo cáo
          </Typography>
          <Chip
            label={`${
              reportedUsers.filter((u) => u.status === "pending").length
            } chờ xử lý`}
            color="warning"
            size="small"
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Người dùng</TableCell>
                <TableCell className="font-semibold">Lý do báo cáo</TableCell>
                <TableCell className="font-semibold">Số lần báo cáo</TableCell>
                <TableCell className="font-semibold">Mức độ</TableCell>
                <TableCell className="font-semibold">Trạng thái</TableCell>
                <TableCell className="font-semibold">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Box className="flex items-center space-x-2">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.reason}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user.lastReport}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="font-medium">
                      {user.reportCount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.severity === "high"
                          ? "Cao"
                          : user.severity === "medium"
                          ? "Trung bình"
                          : "Thấp"
                      }
                      color={getSeverityColor(user.severity)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(user.status)}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => handleUserClick(user)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {user.status === "pending" && (
                        <>
                          <Tooltip title="Đã xem xét">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleUpdateUserStatus(user.id, "reviewed")
                              }
                            >
                              <Check />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Khóa tài khoản">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleUpdateUserStatus(user.id, "resolved")
                              }
                            >
                              <Block />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Thống kê hệ thống
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Tổng quan về hiệu suất và hoạt động của hệ thống
        </Typography>
      </Box>

      {/* Statistics Cards */}
      {renderStatisticsCards()}

      {/* Activity Chart */}
      {renderActivityChart()}

      {/* Reported Users */}
      {renderReportedUsers()}

      {/* User Detail Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết báo cáo người dùng
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Họ tên"
                  fullWidth
                  value={selectedUser.name}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={selectedUser.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={selectedUser.phone}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Vai trò"
                  fullWidth
                  value={
                    selectedUser.role === "student" ? "Học sinh" : "Giáo viên"
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lý do báo cáo"
                  fullWidth
                  value={selectedUser.reason}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số lần báo cáo"
                  fullWidth
                  value={selectedUser.reportCount}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lần báo cáo cuối"
                  fullWidth
                  value={selectedUser.lastReport}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mức độ nghiêm trọng"
                  fullWidth
                  value={
                    selectedUser.severity === "high"
                      ? "Cao"
                      : selectedUser.severity === "medium"
                      ? "Trung bình"
                      : "Thấp"
                  }
                  disabled
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenUserDialog(false)} color="secondary">
            Đóng
          </Button>
          {selectedUser && selectedUser.status === "pending" && (
            <>
              <Button
                onClick={() => {
                  handleUpdateUserStatus(selectedUser.id, "reviewed");
                  setOpenUserDialog(false);
                }}
                variant="contained"
                color="success"
              >
                Đã xem xét
              </Button>
              <Button
                onClick={() => {
                  handleUpdateUserStatus(selectedUser.id, "resolved");
                  setOpenUserDialog(false);
                }}
                variant="contained"
                color="error"
              >
                Khóa tài khoản
              </Button>
            </>
          )}
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

export default StatisticsTab;
