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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  AdminPanelSettings,
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
  Group,
  Assignment,
  Book,
  Message,
  History,
  Timeline,
  BarChart,
  PieChart,
  TableChart,
} from "@mui/icons-material";

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    role: "student",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "2024-01-20 14:30",
    totalClasses: 5,
    completedLessons: 12,
    isOnline: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0987654321",
    role: "teacher",
    status: "active",
    joinDate: "2023-12-01",
    lastLogin: "2024-01-20 15:45",
    totalClasses: 8,
    completedLessons: 45,
    isOnline: false,
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0111222333",
    role: "admin",
    status: "active",
    joinDate: "2023-11-01",
    lastLogin: "2024-01-20 16:20",
    totalClasses: 0,
    completedLessons: 0,
    isOnline: true,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0444555666",
    role: "student",
    status: "locked",
    joinDate: "2024-01-10",
    lastLogin: "2024-01-18 09:15",
    totalClasses: 2,
    completedLessons: 3,
    isOnline: false,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0777888999",
    role: "teacher",
    status: "active",
    joinDate: "2023-10-15",
    lastLogin: "2024-01-20 13:10",
    totalClasses: 12,
    completedLessons: 78,
    isOnline: true,
  },
];

const roles = [
  { value: "student", label: "Học sinh", color: "primary" },
  { value: "teacher", label: "Giáo viên", color: "success" },
  { value: "admin", label: "Admin", color: "error" },
];

const statuses = [
  { value: "active", label: "Hoạt động", color: "success" },
  { value: "locked", label: "Đã khóa", color: "error" },
  { value: "pending", label: "Chờ xác thực", color: "warning" },
];

function UserManagementTab() {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
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
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleSaveUser = () => {
    if (selectedUser) {
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      setSnackbar({
        open: true,
        message: "Cập nhật thông tin người dùng thành công!",
        severity: "success",
      });
      setOpenUserDialog(false);
      setSelectedUser(null);
    }
  };

  const handleAddUser = () => {
    const newUserWithId = {
      ...newUser,
      id: Date.now(),
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toLocaleString(),
      totalClasses: 0,
      completedLessons: 0,
      isOnline: false,
    };
    setUsers([...users, newUserWithId]);
    setNewUser({ name: "", email: "", phone: "", role: "student" });
    setOpenAddUserDialog(false);
    setSnackbar({
      open: true,
      message: "Thêm người dùng mới thành công!",
      severity: "success",
    });
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "locked" : "active" }
          : user
      )
    );
    setSnackbar({
      open: true,
      message: "Cập nhật trạng thái người dùng thành công!",
      severity: "success",
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((user) => user.id !== userId));
      setSnackbar({
        open: true,
        message: "Xóa người dùng thành công!",
        severity: "success",
      });
    }
  };

  const getRoleColor = (role) => {
    return roles.find((r) => r.value === role)?.color || "default";
  };

  const getRoleLabel = (role) => {
    return roles.find((r) => r.value === role)?.label || role;
  };

  const getStatusColor = (status) => {
    return statuses.find((s) => s.value === status)?.color || "default";
  };

  const getStatusLabel = (status) => {
    return statuses.find((s) => s.value === status)?.label || status;
  };

  const renderUserTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Người dùng</TableCell>
            <TableCell className="font-semibold">Liên hệ</TableCell>
            <TableCell className="font-semibold">Vai trò</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Thống kê</TableCell>
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
                      ID: {user.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{user.email}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {user.phone}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={getRoleLabel(user.role)}
                  color={getRoleColor(user.role)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Chip
                    label={getStatusLabel(user.status)}
                    color={getStatusColor(user.status)}
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
                <Typography variant="body2">
                  {user.role === "teacher"
                    ? `${user.totalClasses} lớp`
                    : `${user.completedLessons} bài`}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user.role === "teacher" ? "đang dạy" : "đã hoàn thành"}
                </Typography>
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
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      size="small"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      user.status === "active" ? "Khóa tài khoản" : "Mở khóa"
                    }
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleToggleUserStatus(user.id)}
                      color={user.status === "active" ? "warning" : "success"}
                    >
                      {user.status === "active" ? <Lock /> : <LockOpen />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
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
                      label={getRoleLabel(user.role)}
                      color={getRoleColor(user.role)}
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
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="body2">
                    Tham gia: {user.joinDate}
                  </Typography>
                </Box>
              </Stack>

              <Divider className="my-2" />

              <Box className="flex items-center justify-between mb-3">
                <Chip
                  label={getStatusLabel(user.status)}
                  color={getStatusColor(user.status)}
                  size="small"
                />
                <Typography variant="caption" color="textSecondary">
                  {user.role === "teacher"
                    ? `${user.totalClasses} lớp`
                    : `${user.completedLessons} bài`}
                </Typography>
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
          Quản lý người dùng
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý tất cả người dùng trong hệ thống, bao gồm học sinh, giáo viên
          và admin
        </Typography>
      </Box>

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
            <Grid item xs={12} md={2}>
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
            <Grid item xs={12} md={4}>
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
                  onClick={() => setOpenAddUserDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Thêm người dùng
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
          Chi tiết người dùng
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Họ tên"
                  fullWidth
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={selectedUser.phone}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, phone: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, role: e.target.value })
                    }
                    label="Vai trò"
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
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={selectedUser.status}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        status: e.target.value,
                      })
                    }
                    label="Trạng thái"
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedUser.isOnline}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
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
          <Button onClick={() => setOpenUserDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Thêm người dùng mới
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <TextField
            label="Họ tên"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              label="Vai trò"
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
          <Button onClick={() => setOpenAddUserDialog(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleAddUser} variant="contained" color="primary">
            Thêm người dùng
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

export default UserManagementTab;
