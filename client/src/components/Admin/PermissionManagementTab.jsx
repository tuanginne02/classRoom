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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
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
  Security,
  AdminPanelSettings,
  SupervisorAccount,
  VerifiedUser,
  Gavel,
  Shield,
  Key,
  VpnKey,
} from "@mui/icons-material";

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    currentRole: "student",
    newRole: "student",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20 14:30",
    permissions: ["view_profile", "join_classes"],
    isOnline: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    currentRole: "teacher",
    newRole: "teacher",
    status: "active",
    joinDate: "2023-12-01",
    lastLogin: "2024-01-20 15:45",
    permissions: [
      "view_profile",
      "create_classes",
      "manage_students",
      "grade_assignments",
    ],
    isOnline: false,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0111222333",
    currentRole: "admin",
    newRole: "admin",
    status: "active",
    joinDate: "2023-11-01",
    lastLogin: "2024-01-20 16:20",
    permissions: [
      "view_profile",
      "manage_users",
      "manage_teachers",
      "manage_classes",
      "system_config",
      "view_reports",
    ],
    isOnline: true,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0444555666",
    currentRole: "student",
    newRole: "student",
    status: "locked",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-18 09:15",
    permissions: ["view_profile"],
    isOnline: false,
  },
];

const roles = [
  {
    value: "student",
    label: "Học sinh",
    color: "primary",
    permissions: ["view_profile", "join_classes", "submit_assignments"],
  },
  {
    value: "teacher",
    label: "Giáo viên",
    color: "success",
    permissions: [
      "view_profile",
      "create_classes",
      "manage_students",
      "grade_assignments",
      "view_reports",
    ],
  },
  {
    value: "moderator",
    label: "Moderator",
    color: "warning",
    permissions: [
      "view_profile",
      "manage_users",
      "moderate_content",
      "view_reports",
    ],
  },
  {
    value: "admin",
    label: "Admin",
    color: "error",
    permissions: [
      "view_profile",
      "manage_users",
      "manage_teachers",
      "manage_classes",
      "system_config",
      "view_reports",
      "manage_permissions",
    ],
  },
  {
    value: "super_admin",
    label: "Super Admin",
    color: "error",
    permissions: [
      "view_profile",
      "manage_users",
      "manage_teachers",
      "manage_classes",
      "system_config",
      "view_reports",
      "manage_permissions",
      "system_backup",
      "security_settings",
    ],
  },
];

const allPermissions = [
  "view_profile",
  "join_classes",
  "submit_assignments",
  "create_classes",
  "manage_students",
  "grade_assignments",
  "moderate_content",
  "manage_users",
  "manage_teachers",
  "manage_classes",
  "system_config",
  "view_reports",
  "manage_permissions",
  "system_backup",
  "security_settings",
];

function PermissionManagementTab() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openAddAdminDialog, setOpenAddAdminDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    permissions: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.currentRole === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser({ ...user, newRole: user.currentRole });
    setOpenUserDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user, newRole: user.currentRole });
    setOpenUserDialog(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        currentRole: selectedUser.newRole,
        permissions:
          roles.find((r) => r.value === selectedUser.newRole)?.permissions ||
          [],
      };

      setUsers(
        users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );
      setSnackbar({
        open: true,
        message: "Cập nhật vai trò người dùng thành công!",
        severity: "success",
      });
      setOpenUserDialog(false);
      setSelectedUser(null);
    }
  };

  const handleAddAdmin = () => {
    const newAdminWithId = {
      ...newAdmin,
      id: Date.now(),
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toLocaleString(),
      currentRole: newAdmin.role,
      permissions:
        roles.find((r) => r.value === newAdmin.role)?.permissions || [],
      isOnline: false,
    };
    setUsers([...users, newAdminWithId]);
    setNewAdmin({
      name: "",
      email: "",
      phone: "",
      role: "admin",
      permissions: [],
    });
    setOpenAddAdminDialog(false);
    setSnackbar({
      open: true,
      message: "Thêm admin mới thành công!",
      severity: "success",
    });
  };

  const handlePermissionChange = (permission) => {
    if (selectedUser) {
      const newPermissions = selectedUser.permissions.includes(permission)
        ? selectedUser.permissions.filter((p) => p !== permission)
        : [...selectedUser.permissions, permission];

      setSelectedUser({ ...selectedUser, permissions: newPermissions });
    }
  };

  const getRoleColor = (role) => {
    return roles.find((r) => r.value === role)?.color || "default";
  };

  const getRoleLabel = (role) => {
    return roles.find((r) => r.value === role)?.label || role;
  };

  const getPermissionLabel = (permission) => {
    const labels = {
      view_profile: "Xem hồ sơ",
      join_classes: "Tham gia lớp học",
      submit_assignments: "Nộp bài tập",
      create_classes: "Tạo lớp học",
      manage_students: "Quản lý học sinh",
      grade_assignments: "Chấm điểm",
      moderate_content: "Kiểm duyệt nội dung",
      manage_users: "Quản lý người dùng",
      manage_teachers: "Quản lý giáo viên",
      manage_classes: "Quản lý lớp học",
      system_config: "Cấu hình hệ thống",
      view_reports: "Xem báo cáo",
      manage_permissions: "Quản lý quyền",
      system_backup: "Sao lưu hệ thống",
      security_settings: "Cài đặt bảo mật",
    };
    return labels[permission] || permission;
  };

  const renderUserTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Người dùng</TableCell>
            <TableCell className="font-semibold">Vai trò hiện tại</TableCell>
            <TableCell className="font-semibold">Quyền hạn</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-gray-50">
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Avatar sx={{ width: 40, height: 40 }}>
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
                <Chip
                  label={getRoleLabel(user.currentRole)}
                  color={getRoleColor(user.currentRole)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 3).map((permission) => (
                    <Chip
                      key={permission}
                      label={getPermissionLabel(permission)}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {user.permissions.length > 3 && (
                    <Chip
                      label={`+${user.permissions.length - 3}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Chip
                    label={user.status === "active" ? "Hoạt động" : "Đã khóa"}
                    color={user.status === "active" ? "success" : "error"}
                    size="small"
                  />
                  <Box
                    className={`w-2 h-2 rounded-full ${
                      user.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </Box>
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
                  <Tooltip title="Chỉnh sửa quyền">
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit />
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

  const renderUserCards = () => (
    <Grid container spacing={3}>
      {filteredUsers.map((user) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <Box className="flex items-start justify-between mb-3">
                <Box className="flex items-center space-x-3">
                  <Avatar sx={{ width: 48, height: 48 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" className="font-semibold">
                      {user.name}
                    </Typography>
                    <Chip
                      label={getRoleLabel(user.currentRole)}
                      color={getRoleColor(user.currentRole)}
                      size="small"
                      className="mt-1"
                    />
                  </Box>
                </Box>
                <Box
                  className={`w-3 h-3 rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </Box>

              <Stack spacing={1} className="mb-3">
                <Box className="flex items-center space-x-2">
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" className="truncate">
                    {user.email}
                  </Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{user.phone}</Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Security fontSize="small" color="action" />
                  <Typography variant="body2">
                    {user.permissions.length} quyền
                  </Typography>
                </Box>
              </Stack>

              <Divider className="my-2" />

              <Box className="mb-3">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="mb-2"
                >
                  Quyền hạn chính:
                </Typography>
                <Box className="flex flex-wrap gap-1">
                  {user.permissions.slice(0, 2).map((permission) => (
                    <Chip
                      key={permission}
                      label={getPermissionLabel(permission)}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {user.permissions.length > 2 && (
                    <Chip
                      label={`+${user.permissions.length - 2}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleUserClick(user)}
                  fullWidth
                >
                  Chi tiết
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEditUser(user)}
                  fullWidth
                >
                  Sửa quyền
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
          Phân quyền & vai trò
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý vai trò và quyền hạn của người dùng trong hệ thống
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {users.filter((u) => u.currentRole === "student").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Học sinh
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
                    {users.filter((u) => u.currentRole === "teacher").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Giáo viên
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
                  <AdminPanelSettings />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {
                      users.filter(
                        (u) =>
                          u.currentRole === "admin" ||
                          u.currentRole === "super_admin"
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Admin
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
                  <Security />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {users.filter((u) => u.currentRole === "moderator").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Moderator
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
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={handleRoleFilterChange}
                  label="Vai trò"
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
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
                  onClick={() => setOpenAddAdminDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm Admin
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box className="mb-4">
        <Typography variant="body2" color="textSecondary">
          Hiển thị {filteredUsers.length} trong tổng số {users.length} người
          dùng
        </Typography>
      </Box>

      {/* User List */}
      {viewMode === "table" ? renderUserTable() : renderUserCards()}

      {/* User Detail Dialog */}
      <Dialog
        open={openUserDialog}
        onClose={() => setOpenUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Quản lý quyền người dùng
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
                <FormControl fullWidth>
                  <InputLabel>Vai trò mới</InputLabel>
                  <Select
                    value={selectedUser.newRole}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        newRole: e.target.value,
                      })
                    }
                    label="Vai trò mới"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="textSecondary">
                  Vai trò hiện tại: {getRoleLabel(selectedUser.currentRole)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" className="font-bold mb-2">
                  Quyền hạn chi tiết:
                </Typography>
                <Box className="grid grid-cols-2 gap-2">
                  {allPermissions.map((permission) => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Checkbox
                          checked={selectedUser.permissions.includes(
                            permission
                          )}
                          onChange={() => handlePermissionChange(permission)}
                        />
                      }
                      label={getPermissionLabel(permission)}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button onClick={() => setOpenUserDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Admin Dialog */}
      <Dialog
        open={openAddAdminDialog}
        onClose={() => setOpenAddAdminDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Thêm Admin mới
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Họ tên"
            fullWidth
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            value={newAdmin.phone}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, phone: e.target.value })
            }
          />
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={newAdmin.role}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, role: e.target.value })
              }
              label="Vai trò"
            >
              {roles
                .filter((role) => role.value !== "student")
                .map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenAddAdminDialog(false)}
            color="secondary"
          >
            Hủy
          </Button>
          <Button onClick={handleAddAdmin} variant="contained" color="primary">
            Thêm Admin
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

export default PermissionManagementTab;
