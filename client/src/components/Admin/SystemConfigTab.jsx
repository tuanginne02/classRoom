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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  //  Success,
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
  Settings,
  Domain,
  Link,
  Notifications,
  SystemUpdate,
  Security,
  Storage,
  Backup,
  Restore,
  Save,
  Cancel,
  ExpandMore,
  Language,
  Public,
  VpnKey,
  Email as EmailIcon,
  Sms,
  CloudUpload,
  CloudDownload,
  Code,
  BugReport,
  Build,
  Tune,
  Dashboard,
  AdminPanelSettings,
} from "@mui/icons-material";

// Mock data for demonstration
const mockSystemConfig = {
  domain: "classroom.example.com",
  email: {
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    username: "noreply@classroom.example.com",
    password: "********",
    fromName: "Classroom System",
  },
  externalLinks: [
    {
      id: 1,
      name: "Google Classroom",
      url: "https://classroom.google.com",
      description: "Tích hợp với Google Classroom",
      status: "active",
    },
    {
      id: 2,
      name: "Microsoft Teams",
      url: "https://teams.microsoft.com",
      description: "Tích hợp với Microsoft Teams",
      status: "inactive",
    },
  ],
  features: [
    {
      id: "new_class_registration",
      name: "Đăng ký lớp mới",
      description: "Cho phép giáo viên tạo lớp học mới",
      status: true,
    },
    {
      id: "student_registration",
      name: "Đăng ký học sinh",
      description: "Cho phép học sinh tự đăng ký tài khoản",
      status: true,
    },
    {
      id: "file_upload",
      name: "Upload file",
      description: "Cho phép upload file bài tập",
      status: true,
    },
    {
      id: "video_call",
      name: "Video call",
      description: "Tính năng gọi video trong lớp học",
      status: false,
    },
    {
      id: "advanced_analytics",
      name: "Phân tích nâng cao",
      description: "Hiển thị thống kê chi tiết cho admin",
      status: true,
    },
  ],
  notifications: [
    {
      id: 1,
      title: "Bảo trì hệ thống",
      content: "Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai",
      type: "maintenance",
      status: "active",
      createdAt: "2024-01-20 10:00",
      expiresAt: "2024-01-21 04:00",
    },
    {
      id: 2,
      title: "Cập nhật tính năng mới",
      content: "Đã thêm tính năng chat nhóm và chia sẻ file",
      type: "update",
      status: "active",
      createdAt: "2024-01-19 15:30",
      expiresAt: "2024-01-26 15:30",
    },
  ],
};

function SystemConfigTab() {
  const [config, setConfig] = useState(mockSystemConfig);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [newLink, setNewLink] = useState({
    name: "",
    url: "",
    description: "",
  });
  const [newNotification, setNewNotification] = useState({
    title: "",
    content: "",
    type: "info",
    expiresAt: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFeatureToggle = (featureId) => {
    setConfig({
      ...config,
      features: config.features.map((feature) =>
        feature.id === featureId
          ? { ...feature, status: !feature.status }
          : feature
      ),
    });
    setSnackbar({
      open: true,
      message: "Cập nhật tính năng thành công!",
      severity: "success",
    });
  };

  const handleSaveEmailConfig = () => {
    setSnackbar({
      open: true,
      message: "Lưu cấu hình email thành công!",
      severity: "success",
    });
    setOpenEmailDialog(false);
  };

  const handleSaveLink = () => {
    if (selectedLink) {
      // Update existing link
      setConfig({
        ...config,
        externalLinks: config.externalLinks.map((link) =>
          link.id === selectedLink.id ? selectedLink : link
        ),
      });
    } else {
      // Add new link
      const newLinkWithId = {
        ...newLink,
        id: Date.now(),
        status: "active",
      };
      setConfig({
        ...config,
        externalLinks: [...config.externalLinks, newLinkWithId],
      });
      setNewLink({ name: "", url: "", description: "" });
    }
    setSnackbar({
      open: true,
      message: selectedLink
        ? "Cập nhật liên kết thành công!"
        : "Thêm liên kết thành công!",
      severity: "success",
    });
    setOpenLinkDialog(false);
    setSelectedLink(null);
  };

  const handleSaveNotification = () => {
    if (selectedNotification) {
      // Update existing notification
      setConfig({
        ...config,
        notifications: config.notifications.map((notification) =>
          notification.id === selectedNotification.id
            ? selectedNotification
            : notification
        ),
      });
    } else {
      // Add new notification
      const newNotificationWithId = {
        ...newNotification,
        id: Date.now(),
        status: "active",
        createdAt: new Date().toLocaleString(),
      };
      setConfig({
        ...config,
        notifications: [...config.notifications, newNotificationWithId],
      });
      setNewNotification({
        title: "",
        content: "",
        type: "info",
        expiresAt: "",
      });
    }
    setSnackbar({
      open: true,
      message: selectedNotification
        ? "Cập nhật thông báo thành công!"
        : "Thêm thông báo thành công!",
      severity: "success",
    });
    setOpenNotificationDialog(false);
    setSelectedNotification(null);
  };

  const handleDeleteLink = (linkId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên kết này?")) {
      setConfig({
        ...config,
        externalLinks: config.externalLinks.filter(
          (link) => link.id !== linkId
        ),
      });
      setSnackbar({
        open: true,
        message: "Xóa liên kết thành công!",
        severity: "success",
      });
    }
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      setConfig({
        ...config,
        notifications: config.notifications.filter(
          (notification) => notification.id !== notificationId
        ),
      });
      setSnackbar({
        open: true,
        message: "Xóa thông báo thành công!",
        severity: "success",
      });
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "maintenance":
        return "warning";
      case "update":
        return "info";
      case "error":
        return "error";
      default:
        return "primary";
    }
  };

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case "maintenance":
        return "Bảo trì";
      case "update":
        return "Cập nhật";
      case "error":
        return "Lỗi";
      default:
        return "Thông tin";
    }
  };

  const renderDomainConfig = () => (
    <Card elevation={2} className="rounded-xl mb-6">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-bold mb-4">
          Cấu hình Domain & Email
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Domain chính"
              fullWidth
              value={config.domain}
              onChange={(e) => setConfig({ ...config, domain: e.target.value })}
              InputProps={{
                startAdornment: <Domain className="mr-2 text-gray-400" />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => setOpenEmailDialog(true)}
              fullWidth
            >
              Cấu hình Email
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderFeaturesConfig = () => (
    <Card elevation={2} className="rounded-xl mb-6">
      <CardContent className="p-6">
        <Typography variant="h6" className="font-bold mb-4">
          Quản lý tính năng
        </Typography>
        <Grid container spacing={2}>
          {config.features.map((feature) => (
            <Grid item xs={12} md={6} key={feature.id}>
              <Box className="flex items-center justify-between p-4 border rounded-lg">
                <Box>
                  <Typography variant="body1" className="font-medium">
                    {feature.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={feature.status}
                      onChange={() => handleFeatureToggle(feature.id)}
                      color="primary"
                    />
                  }
                  label=""
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderExternalLinks = () => (
    <Card elevation={2} className="rounded-xl mb-6">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-bold">
            Liên kết hệ thống ngoài
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenLinkDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm liên kết
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Tên</TableCell>
                <TableCell className="font-semibold">URL</TableCell>
                <TableCell className="font-semibold">Mô tả</TableCell>
                <TableCell className="font-semibold">Trạng thái</TableCell>
                <TableCell className="font-semibold">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {config.externalLinks.map((link) => (
                <TableRow key={link.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Typography variant="body2" className="font-medium">
                      {link.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" className="text-blue-600">
                      {link.url}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {link.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        link.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"
                      }
                      color={link.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedLink(link);
                            setOpenLinkDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteLink(link.id)}
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
      </CardContent>
    </Card>
  );

  const renderNotifications = () => (
    <Card elevation={2} className="rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-bold">
            Thông báo hệ thống
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenNotificationDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Thêm thông báo
          </Button>
        </Box>

        <Grid container spacing={3}>
          {config.notifications.map((notification) => (
            <Grid item xs={12} md={6} key={notification.id}>
              <Card elevation={1} className="rounded-lg">
                <CardContent className="p-4">
                  <Box className="flex items-start justify-between mb-2">
                    <Box className="flex items-center space-x-2">
                      <Chip
                        label={getNotificationTypeLabel(notification.type)}
                        color={getNotificationTypeColor(notification.type)}
                        size="small"
                      />
                      <Chip
                        label={
                          notification.status === "active"
                            ? "Đang hiển thị"
                            : "Đã ẩn"
                        }
                        color={
                          notification.status === "active"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedNotification(notification);
                            setOpenNotificationDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>

                  <Typography variant="h6" className="font-semibold mb-2">
                    {notification.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="mb-3"
                  >
                    {notification.content}
                  </Typography>

                  <Box className="flex items-center justify-between text-sm text-gray-500">
                    <Typography variant="caption">
                      Tạo: {notification.createdAt}
                    </Typography>
                    <Typography variant="caption">
                      Hết hạn: {notification.expiresAt}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold mb-2">
          Cấu hình hệ thống
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý cấu hình domain, email, liên kết hệ thống và thông báo toàn hệ
          thống
        </Typography>
      </Box>

      {/* Domain & Email Config */}
      {renderDomainConfig()}

      {/* Features Config */}
      {renderFeaturesConfig()}

      {/* External Links */}
      {renderExternalLinks()}

      {/* Notifications */}
      {renderNotifications()}

      {/* Email Config Dialog */}
      <Dialog
        open={openEmailDialog}
        onClose={() => setOpenEmailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Cấu hình Email
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="SMTP Server"
                fullWidth
                value={config.email.smtpServer}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    email: { ...config.email, smtpServer: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="SMTP Port"
                fullWidth
                type="number"
                value={config.email.smtpPort}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    email: {
                      ...config.email,
                      smtpPort: parseInt(e.target.value),
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                fullWidth
                value={config.email.username}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    email: { ...config.email, username: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                fullWidth
                type="password"
                value={config.email.password}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    email: { ...config.email, password: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="From Name"
                fullWidth
                value={config.email.fromName}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    email: { ...config.email, fromName: e.target.value },
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenEmailDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSaveEmailConfig}
            variant="contained"
            color="primary"
          >
            Lưu cấu hình
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link Dialog */}
      <Dialog
        open={openLinkDialog}
        onClose={() => {
          setOpenLinkDialog(false);
          setSelectedLink(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          {selectedLink ? "Chỉnh sửa liên kết" : "Thêm liên kết mới"}
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Tên liên kết"
            fullWidth
            value={selectedLink ? selectedLink.name : newLink.name}
            onChange={(e) =>
              selectedLink
                ? setSelectedLink({ ...selectedLink, name: e.target.value })
                : setNewLink({ ...newLink, name: e.target.value })
            }
          />
          <TextField
            label="URL"
            fullWidth
            value={selectedLink ? selectedLink.url : newLink.url}
            onChange={(e) =>
              selectedLink
                ? setSelectedLink({ ...selectedLink, url: e.target.value })
                : setNewLink({ ...newLink, url: e.target.value })
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={
              selectedLink ? selectedLink.description : newLink.description
            }
            onChange={(e) =>
              selectedLink
                ? setSelectedLink({
                    ...selectedLink,
                    description: e.target.value,
                  })
                : setNewLink({ ...newLink, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => {
              setOpenLinkDialog(false);
              setSelectedLink(null);
            }}
            color="secondary"
          >
            Hủy
          </Button>
          <Button onClick={handleSaveLink} variant="contained" color="primary">
            {selectedLink ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog
        open={openNotificationDialog}
        onClose={() => {
          setOpenNotificationDialog(false);
          setSelectedNotification(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          {selectedNotification ? "Chỉnh sửa thông báo" : "Thêm thông báo mới"}
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Tiêu đề"
            fullWidth
            value={
              selectedNotification
                ? selectedNotification.title
                : newNotification.title
            }
            onChange={(e) =>
              selectedNotification
                ? setSelectedNotification({
                    ...selectedNotification,
                    title: e.target.value,
                  })
                : setNewNotification({
                    ...newNotification,
                    title: e.target.value,
                  })
            }
          />
          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={4}
            value={
              selectedNotification
                ? selectedNotification.content
                : newNotification.content
            }
            onChange={(e) =>
              selectedNotification
                ? setSelectedNotification({
                    ...selectedNotification,
                    content: e.target.value,
                  })
                : setNewNotification({
                    ...newNotification,
                    content: e.target.value,
                  })
            }
          />
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại thông báo</InputLabel>
                <Select
                  value={
                    selectedNotification
                      ? selectedNotification.type
                      : newNotification.type
                  }
                  onChange={(e) =>
                    selectedNotification
                      ? setSelectedNotification({
                          ...selectedNotification,
                          type: e.target.value,
                        })
                      : setNewNotification({
                          ...newNotification,
                          type: e.target.value,
                        })
                  }
                  label="Loại thông báo"
                >
                  <MenuItem value="info">Thông tin</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                  <MenuItem value="update">Cập nhật</MenuItem>
                  <MenuItem value="error">Lỗi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Hết hạn"
                fullWidth
                type="datetime-local"
                value={
                  selectedNotification
                    ? selectedNotification.expiresAt
                    : newNotification.expiresAt
                }
                onChange={(e) =>
                  selectedNotification
                    ? setSelectedNotification({
                        ...selectedNotification,
                        expiresAt: e.target.value,
                      })
                    : setNewNotification({
                        ...newNotification,
                        expiresAt: e.target.value,
                      })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => {
              setOpenNotificationDialog(false);
              setSelectedNotification(null);
            }}
            color="secondary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveNotification}
            variant="contained"
            color="primary"
          >
            {selectedNotification ? "Cập nhật" : "Thêm"}
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

export default SystemConfigTab;
