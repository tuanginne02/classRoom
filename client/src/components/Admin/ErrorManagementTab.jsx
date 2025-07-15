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
  TextareaAutosize,
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
  BugReport,
  Feedback,
  Report,
  Flag,
  PriorityHigh,
  LowPriority,
  Schedule,
  Event,
  Notifications,
  Speed,
  Timer,
  Assessment,
  Analytics,
} from "@mui/icons-material";

// Mock data for demonstration
const mockIssues = [
  {
    id: 1,
    title: "Học sinh không vào được lớp học",
    description:
      "Một số học sinh báo cáo không thể tham gia vào lớp học Toán 10A",
    type: "system_error",
    priority: "high",
    status: "open",
    reportedBy: "Nguyễn Văn A",
    reportedAt: "2024-01-20 14:30",
    assignedTo: "Admin",
    lastUpdated: "2024-01-20 15:45",
    affectedUsers: 5,
    category: "classroom_access",
  },
  {
    id: 2,
    title: "OTP không gửi được",
    description: "Hệ thống không gửi được mã OTP qua SMS cho người dùng mới",
    type: "system_error",
    priority: "high",
    status: "in_progress",
    reportedBy: "Hệ thống",
    reportedAt: "2024-01-20 10:15",
    assignedTo: "Tech Team",
    lastUpdated: "2024-01-20 16:20",
    affectedUsers: 12,
    category: "authentication",
  },
  {
    id: 3,
    title: "Giao diện bị lỗi trên mobile",
    description: "Giao diện dashboard bị vỡ layout trên thiết bị di động",
    type: "ui_bug",
    priority: "medium",
    status: "open",
    reportedBy: "Trần Thị B",
    reportedAt: "2024-01-19 16:30",
    assignedTo: "Frontend Team",
    lastUpdated: "2024-01-20 09:15",
    affectedUsers: 25,
    category: "user_interface",
  },
  {
    id: 4,
    title: "Tốc độ tải trang chậm",
    description: "Trang dashboard tải rất chậm, đặc biệt khi có nhiều dữ liệu",
    type: "performance",
    priority: "medium",
    status: "resolved",
    reportedBy: "Lê Văn C",
    reportedAt: "2024-01-18 11:20",
    assignedTo: "Backend Team",
    lastUpdated: "2024-01-20 14:00",
    affectedUsers: 50,
    category: "performance",
  },
];

const mockFeedback = [
  {
    id: 1,
    title: "Giao diện rất đẹp và dễ sử dụng",
    content:
      "Tôi rất thích giao diện mới của hệ thống. Nó trực quan và dễ sử dụng hơn nhiều so với phiên bản cũ.",
    type: "positive",
    rating: 5,
    submittedBy: "Nguyễn Thị D",
    submittedAt: "2024-01-20 15:30",
    status: "reviewed",
    category: "user_experience",
  },
  {
    id: 2,
    title: "Cần cải thiện tính năng chat",
    content:
      "Tính năng chat cần được cải thiện. Hiện tại khó theo dõi tin nhắn cũ và không có thông báo khi có tin nhắn mới.",
    type: "suggestion",
    rating: 3,
    submittedBy: "Phạm Văn E",
    submittedAt: "2024-01-20 12:45",
    status: "pending",
    category: "communication",
  },
  {
    id: 3,
    title: "Lỗi khi upload file",
    content:
      "Khi tôi cố gắng upload file bài tập, hệ thống báo lỗi và không thể upload được. File có kích thước 5MB.",
    type: "bug_report",
    rating: 2,
    submittedBy: "Hoàng Thị F",
    submittedAt: "2024-01-20 10:20",
    status: "in_progress",
    category: "file_upload",
  },
];

const issueTypes = [
  { value: "system_error", label: "Lỗi hệ thống", color: "error" },
  { value: "ui_bug", label: "Lỗi giao diện", color: "warning" },
  { value: "performance", label: "Vấn đề hiệu suất", color: "info" },
  { value: "feature_request", label: "Yêu cầu tính năng", color: "primary" },
];

const priorities = [
  { value: "high", label: "Cao", color: "error" },
  { value: "medium", label: "Trung bình", color: "warning" },
  { value: "low", label: "Thấp", color: "info" },
];

const statuses = [
  { value: "open", label: "Mở", color: "warning" },
  { value: "in_progress", label: "Đang xử lý", color: "info" },
  { value: "resolved", label: "Đã giải quyết", color: "success" },
  { value: "closed", label: "Đã đóng", color: "default" },
];

const feedbackTypes = [
  { value: "positive", label: "Tích cực", color: "success" },
  { value: "suggestion", label: "Đề xuất", color: "primary" },
  { value: "bug_report", label: "Báo lỗi", color: "error" },
  { value: "complaint", label: "Khiếu nại", color: "warning" },
];

function ErrorManagementTab() {
  const [issues, setIssues] = useState(mockIssues);
  const [feedback, setFeedback] = useState(mockFeedback);
  const [filteredIssues, setFilteredIssues] = useState(mockIssues);
  const [filteredFeedback, setFilteredFeedback] = useState(mockFeedback);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("issues");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter issues based on search and filters
  useEffect(() => {
    let filtered = issues;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((issue) => issue.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, typeFilter, priorityFilter, statusFilter]);

  // Filter feedback based on search
  useEffect(() => {
    let filtered = feedback;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFeedback(filtered);
  }, [feedback, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event) => {
    setPriorityFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setOpenIssueDialog(true);
  };

  const handleFeedbackClick = (item) => {
    setSelectedFeedback(item);
    setOpenFeedbackDialog(true);
  };

  const handleUpdateIssueStatus = (issueId, status) => {
    setIssues(
      issues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status, lastUpdated: new Date().toLocaleString() }
          : issue
      )
    );
    setSnackbar({
      open: true,
      message: "Cập nhật trạng thái sự cố thành công!",
      severity: "success",
    });
  };

  const handleUpdateFeedbackStatus = (feedbackId, status) => {
    setFeedback(
      feedback.map((item) =>
        item.id === feedbackId ? { ...item, status } : item
      )
    );
    setSnackbar({
      open: true,
      message: "Cập nhật trạng thái feedback thành công!",
      severity: "success",
    });
  };

  const getTypeColor = (type) => {
    return issueTypes.find((t) => t.value === type)?.color || "default";
  };

  const getTypeLabel = (type) => {
    return issueTypes.find((t) => t.value === type)?.label || type;
  };

  const getPriorityColor = (priority) => {
    return priorities.find((p) => p.value === priority)?.color || "default";
  };

  const getPriorityLabel = (priority) => {
    return priorities.find((p) => p.value === priority)?.label || priority;
  };

  const getStatusColor = (status) => {
    return statuses.find((s) => s.value === status)?.color || "default";
  };

  const getStatusLabel = (status) => {
    return statuses.find((s) => s.value === status)?.label || status;
  };

  const getFeedbackTypeColor = (type) => {
    return feedbackTypes.find((t) => t.value === type)?.color || "default";
  };

  const getFeedbackTypeLabel = (type) => {
    return feedbackTypes.find((t) => t.value === type)?.label || type;
  };

  const renderIssuesTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Sự cố</TableCell>
            <TableCell className="font-semibold">Loại</TableCell>
            <TableCell className="font-semibold">Ưu tiên</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Người báo cáo</TableCell>
            <TableCell className="font-semibold">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredIssues.map((issue) => (
            <TableRow key={issue.id} className="hover:bg-gray-50">
              <TableCell>
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {issue.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {issue.description.substring(0, 50)}...
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getTypeLabel(issue.type)}
                  color={getTypeColor(issue.type)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={getPriorityLabel(issue.priority)}
                  color={getPriorityColor(issue.priority)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(issue.status)}
                  color={getStatusColor(issue.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{issue.reportedBy}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {issue.reportedAt}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => handleIssueClick(issue)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  {issue.status === "open" && (
                    <>
                      <Tooltip title="Bắt đầu xử lý">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            handleUpdateIssueStatus(issue.id, "in_progress")
                          }
                        >
                          <PlayArrow />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {issue.status === "in_progress" && (
                    <>
                      <Tooltip title="Đã giải quyết">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() =>
                            handleUpdateIssueStatus(issue.id, "resolved")
                          }
                        >
                          <Check />
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
  );

  const renderFeedbackTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Feedback</TableCell>
            <TableCell className="font-semibold">Loại</TableCell>
            <TableCell className="font-semibold">Đánh giá</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Người gửi</TableCell>
            <TableCell className="font-semibold">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredFeedback.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {item.content.substring(0, 50)}...
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getFeedbackTypeLabel(item.type)}
                  color={getFeedbackTypeColor(item.type)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box className="flex items-center space-x-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      sx={{
                        color: index < item.rating ? "gold" : "gray.300",
                        fontSize: 16,
                      }}
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(item.status)}
                  color={getStatusColor(item.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{item.submittedBy}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.submittedAt}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => handleFeedbackClick(item)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  {item.status === "pending" && (
                    <>
                      <Tooltip title="Đã xem xét">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() =>
                            handleUpdateFeedbackStatus(item.id, "reviewed")
                          }
                        >
                          <Check />
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
  );

  return (
    <Box>
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Quản lý lỗi & báo cáo
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Theo dõi và xử lý các sự cố hệ thống và feedback từ người dùng
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
                <Avatar sx={{ bgcolor: "error.main", width: 56, height: 56 }}>
                  <BugReport />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {issues.filter((i) => i.status === "open").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sự cố đang mở
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
                  <PriorityHigh />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {issues.filter((i) => i.priority === "high").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ưu tiên cao
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
                  <Feedback />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {feedback.filter((f) => f.status === "pending").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Feedback chờ xử lý
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {issues.filter((i) => i.status === "resolved").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Đã giải quyết
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card elevation={2} className="rounded-xl mb-6">
        <CardContent className="p-6">
          <Box className="flex items-center justify-between mb-4">
            <ToggleButtonGroup
              value={activeTab}
              exclusive
              onChange={(e, newTab) => newTab && setActiveTab(newTab)}
              size="small"
            >
              <ToggleButton value="issues">
                <BugReport />
                <Typography className="ml-2">Sự cố hệ thống</Typography>
              </ToggleButton>
              <ToggleButton value="feedback">
                <Feedback />
                <Typography className="ml-2">Feedback</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {activeTab === "issues" && (
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm sự cố..."
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
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    label="Loại"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {issueTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Ưu tiên</InputLabel>
                  <Select
                    value={priorityFilter}
                    onChange={handlePriorityFilterChange}
                    label="Ưu tiên"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
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
            </Grid>
          )}

          {activeTab === "feedback" && (
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm feedback..."
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
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === "issues" ? renderIssuesTable() : renderFeedbackTable()}

      {/* Issue Detail Dialog */}
      <Dialog
        open={openIssueDialog}
        onClose={() => setOpenIssueDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết sự cố
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedIssue && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Tiêu đề"
                  fullWidth
                  value={selectedIssue.title}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={4}
                  value={selectedIssue.description}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Loại"
                  fullWidth
                  value={getTypeLabel(selectedIssue.type)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ưu tiên"
                  fullWidth
                  value={getPriorityLabel(selectedIssue.priority)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Người báo cáo"
                  fullWidth
                  value={selectedIssue.reportedBy}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Người được giao"
                  fullWidth
                  value={selectedIssue.assignedTo}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Thời gian báo cáo"
                  fullWidth
                  value={selectedIssue.reportedAt}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cập nhật cuối"
                  fullWidth
                  value={selectedIssue.lastUpdated}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số người bị ảnh hưởng"
                  fullWidth
                  value={selectedIssue.affectedUsers}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Danh mục"
                  fullWidth
                  value={selectedIssue.category}
                  disabled
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenIssueDialog(false)} color="secondary">
            Đóng
          </Button>
          {selectedIssue && selectedIssue.status === "open" && (
            <Button
              onClick={() => {
                handleUpdateIssueStatus(selectedIssue.id, "in_progress");
                setOpenIssueDialog(false);
              }}
              variant="contained"
              color="info"
            >
              Bắt đầu xử lý
            </Button>
          )}
          {selectedIssue && selectedIssue.status === "in_progress" && (
            <Button
              onClick={() => {
                handleUpdateIssueStatus(selectedIssue.id, "resolved");
                setOpenIssueDialog(false);
              }}
              variant="contained"
              color="success"
            >
              Đã giải quyết
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Feedback Detail Dialog */}
      <Dialog
        open={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết feedback
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedFeedback && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Tiêu đề"
                  fullWidth
                  value={selectedFeedback.title}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nội dung"
                  fullWidth
                  multiline
                  rows={4}
                  value={selectedFeedback.content}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Loại"
                  fullWidth
                  value={getFeedbackTypeLabel(selectedFeedback.type)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Đánh giá"
                  fullWidth
                  value={`${selectedFeedback.rating}/5 sao`}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Người gửi"
                  fullWidth
                  value={selectedFeedback.submittedBy}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Thời gian gửi"
                  fullWidth
                  value={selectedFeedback.submittedAt}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Danh mục"
                  fullWidth
                  value={selectedFeedback.category}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Trạng thái"
                  fullWidth
                  value={getStatusLabel(selectedFeedback.status)}
                  disabled
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenFeedbackDialog(false)}
            color="secondary"
          >
            Đóng
          </Button>
          {selectedFeedback && selectedFeedback.status === "pending" && (
            <Button
              onClick={() => {
                handleUpdateFeedbackStatus(selectedFeedback.id, "reviewed");
                setOpenFeedbackDialog(false);
              }}
              variant="contained"
              color="success"
            >
              Đã xem xét
            </Button>
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

export default ErrorManagementTab;
