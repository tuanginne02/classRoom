"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Avatar,
  Badge,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Fab,
} from "@mui/material";
import {
  Dashboard,
  People,
  School,
  Class,
  Security,
  Analytics,
  BugReport,
  Settings,
  Mail,
  Menu,
  Close,
  Logout,
  AdminPanelSettings,
  Notifications,
  Search,
  FilterList,
  Add,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Warning,
  TrendingUp,
  TrendingDown,
  Person,
  Group,
  Book,
  Message,
  Email,
  Phone,
  CalendarToday,
  AccessTime,
  Visibility,
  VisibilityOff,
  Lock,
  LockOpen,
  Refresh,
  Download,
  Upload,
  Save,
  Cancel,
  MoreVert,
  ArrowBack,
  ArrowForward,
  Home,
  Business,
  Assignment,
  Assessment,
  Report,
  Feedback,
  SystemUpdate,
  Domain,
  Link,
  Schedule,
  History,
  Timeline,
  BarChart,
  PieChart,
  TableChart,
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
  Help,
} from "@mui/icons-material";

// Import admin components (will create these next)
import UserManagementTab from "../components/Admin/UserManagementTab";
import TeacherManagementTab from "../components/Admin/TeacherManagementTab";
import ClassManagementTab from "../components/Admin/ClassManagementTab";
import PermissionManagementTab from "../components/Admin/PermissionManagementTab";
import StatisticsTab from "../components/Admin/StatisticsTab";
import ErrorManagementTab from "../components/Admin/ErrorManagementTab";
import SystemConfigTab from "../components/Admin/SystemConfigTab";
import InvitationManagementTab from "../components/Admin/InvitationManagementTab";

const drawerWidth = 280;

const menuItems = [
  {
    id: "dashboard",
    label: "Tổng quan",
    icon: <Dashboard />,
    badge: null,
  },
  {
    id: "users",
    label: "Quản lý người dùng",
    icon: <People />,
    badge: "12",
  },
  {
    id: "teachers",
    label: "Quản lý giáo viên",
    icon: <School />,
    badge: "5",
  },
  {
    id: "classes",
    label: "Quản lý lớp học",
    icon: <Class />,
    badge: "23",
  },
  {
    id: "permissions",
    label: "Phân quyền & vai trò",
    icon: <Security />,
    badge: null,
  },
  {
    id: "statistics",
    label: "Thống kê hệ thống",
    icon: <Analytics />,
    badge: null,
  },
  {
    id: "errors",
    label: "Quản lý lỗi & báo cáo",
    icon: <BugReport />,
    badge: "3",
  },
  {
    id: "config",
    label: "Cấu hình hệ thống",
    icon: <Settings />,
    badge: null,
  },
  {
    id: "invitations",
    label: "Quản lý lời mời",
    icon: <Mail />,
    badge: "8",
  },
];

function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UserManagementTab />;
      case "teachers":
        return <TeacherManagementTab />;
      case "classes":
        return <ClassManagementTab />;
      case "permissions":
        return <PermissionManagementTab />;
      case "statistics":
        return <StatisticsTab />;
      case "errors":
        return <ErrorManagementTab />;
      case "config":
        return <SystemConfigTab />;
      case "invitations":
        return <InvitationManagementTab />;
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => (
    <Box>
      <Typography variant="h4" className="font-bold mb-6">
        Tổng quan hệ thống
      </Typography>

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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    1,234
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Tổng người dùng
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +12% so với tháng trước
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
                    45
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giáo viên hoạt động
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +3 giáo viên mới
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
                    156
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Lớp học đang mở
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    12 lớp sắp kết thúc
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
                <Avatar sx={{ bgcolor: "error.main", width: 56, height: 56 }}>
                  <BugReport />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    3
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sự cố cần xử lý
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    Ưu tiên cao
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2} className="rounded-xl">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold mb-4">
                Hoạt động gần đây
              </Typography>
              <Stack spacing={2}>
                {[
                  {
                    action: "Giáo viên mới đăng ký",
                    user: "Nguyễn Văn A",
                    time: "5 phút trước",
                    type: "success",
                  },
                  {
                    action: "Lớp học mới được tạo",
                    user: "Lớp Toán 10A",
                    time: "15 phút trước",
                    type: "info",
                  },
                  {
                    action: "Báo cáo sự cố",
                    user: "Học sinh không vào được lớp",
                    time: "1 giờ trước",
                    type: "warning",
                  },
                  {
                    action: "Người dùng bị khóa",
                    user: "user123@example.com",
                    time: "2 giờ trước",
                    type: "error",
                  },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <Box className="flex items-center space-x-3">
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: `${activity.type}.main`,
                        }}
                      >
                        {activity.type === "success" && <CheckCircle />}
                        {activity.type === "info" && <Info />}
                        {activity.type === "warning" && <Warning />}
                        {activity.type === "error" && <Error />}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {activity.user}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2} className="rounded-xl">
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold mb-4">
                Thống kê nhanh
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Tỷ lệ hoàn thành bài học
                  </Typography>
                  <Typography variant="h4" className="font-bold text-green-600">
                    87%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Thời gian hoạt động trung bình
                  </Typography>
                  <Typography variant="h4" className="font-bold text-blue-600">
                    2.5h
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Lời mời đang chờ
                  </Typography>
                  <Typography
                    variant="h4"
                    className="font-bold text-orange-600"
                  >
                    8
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const drawer = (
    <Box>
      <Box className="p-4 border-b">
        <Box className="flex items-center space-x-3">
          <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
            <AdminPanelSettings />
          </Avatar>
          <Box>
            <Typography variant="h6" className="font-bold">
              Admin Panel
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Quản lý hệ thống
            </Typography>
          </Box>
        </Box>
      </Box>

      <List className="mt-4">
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              className={`rounded-lg mx-2 mb-1 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <ListItemIcon
                className={
                  activeTab === item.id ? "text-blue-700" : "text-gray-600"
                }
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {item.badge && (
                <Badge
                  badgeContent={item.badge}
                  color="error"
                  className="ml-2"
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider className="my-4" />

      <Box className="p-4">
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          startIcon={<Logout />}
          fullWidth
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
        >
          Đăng xuất
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box className="flex h-screen bg-gray-50">
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" className="font-bold flex-1">
            {menuItems.find((item) => item.id === activeTab)?.label ||
              "Admin Dashboard"}
          </Typography>
          <Box className="flex items-center space-x-2">
            <IconButton color="inherit">
              <Badge badgeContent={notifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 32, height: 32 }}>
              <AdminPanelSettings />
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" className="p-6">
          {renderTabContent()}
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
}

export default AdminDashboard;
