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
  Mail,
  Schedule,
  Event,
  Notifications,
  Link,
  ContentCopy,
  QrCode,
  Share,
  Timer,
  // Expire, 
  // Extend,
  Cancel,
  TrackChanges,
  Visibility as VisibilityIcon,
  PersonAdd,
  GroupAdd,
  School as SchoolIcon,
} from "@mui/icons-material";

// Mock data for demonstration
const mockInvitations = [
  {
    id: 1,
    code: "INV-2024-001",
    type: "student",
    email: "student1@example.com",
    phone: "0123456789",
    createdBy: "Trần Thị B",
    createdAt: "2024-01-20 10:00",
    expiresAt: "2024-01-27 10:00",
    status: "active",
    usedBy: null,
    usedAt: null,
    classId: "CLASS-001",
    className: "Lớp Toán 10A",
    maxUses: 1,
    currentUses: 0,
    description: "Lời mời tham gia lớp Toán 10A",
  },
  {
    id: 2,
    code: "INV-2024-002",
    type: "teacher",
    email: "teacher1@example.com",
    phone: "0987654321",
    createdBy: "Admin",
    createdAt: "2024-01-19 14:30",
    expiresAt: "2024-01-26 14:30",
    status: "used",
    usedBy: "Hoàng Văn E",
    usedAt: "2024-01-20 09:15",
    classId: null,
    className: null,
    maxUses: 1,
    currentUses: 1,
    description: "Lời mời trở thành giáo viên",
  },
  {
    id: 3,
    code: "INV-2024-003",
    type: "student",
    email: "student2@example.com",
    phone: "0111222333",
    createdBy: "Lê Thị F",
    createdAt: "2024-01-18 16:45",
    expiresAt: "2024-01-25 16:45",
    status: "expired",
    usedBy: null,
    usedAt: null,
    classId: "CLASS-002",
    className: "Lớp Vật lý 11B",
    maxUses: 1,
    currentUses: 0,
    description: "Lời mời tham gia lớp Vật lý 11B",
  },
  {
    id: 4,
    code: "INV-2024-004",
    type: "student",
    email: "student3@example.com",
    phone: "0444555666",
    createdBy: "Nguyễn Văn G",
    createdAt: "2024-01-20 08:00",
    expiresAt: "2024-01-21 08:00",
    status: "active",
    usedBy: null,
    usedAt: null,
    classId: "CLASS-003",
    className: "Lớp Hóa học 12C",
    maxUses: 1,
    currentUses: 0,
    description: "Lời mời tham gia lớp Hóa học 12C",
  },
  {
    id: 5,
    code: "INV-2024-005",
    type: "student",
    email: "student4@example.com",
    phone: "0777888999",
    createdBy: "Phạm Thị H",
    createdAt: "2024-01-20 12:00",
    expiresAt: "2024-01-27 12:00",
    status: "active",
    usedBy: null,
    usedAt: null,
    classId: "CLASS-004",
    className: "Lớp Tiếng Anh 9A",
    maxUses: 1,
    currentUses: 0,
    description: "Lời mời tham gia lớp Tiếng Anh 9A",
  },
];

const invitationTypes = [
  { value: "student", label: "Học sinh", color: "primary" },
  { value: "teacher", label: "Giáo viên", color: "success" },
  { value: "admin", label: "Admin", color: "error" },
];

const invitationStatuses = [
  { value: "active", label: "Đang mở", color: "success" },
  { value: "used", label: "Đã sử dụng", color: "info" },
  { value: "expired", label: "Hết hạn", color: "error" },
  { value: "cancelled", label: "Đã hủy", color: "default" },
];

function InvitationManagementTab() {
  const [invitations, setInvitations] = useState(mockInvitations);
  const [filteredInvitations, setFilteredInvitations] =
    useState(mockInvitations);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [openInvitationDialog, setOpenInvitationDialog] = useState(false);
  const [openAddInvitationDialog, setOpenAddInvitationDialog] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    type: "student",
    email: "",
    phone: "",
    classId: "",
    className: "",
    description: "",
    maxUses: 1,
    expiresIn: 7, // days
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Filter invitations based on search and filters
  useEffect(() => {
    let filtered = invitations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invitation) =>
          invitation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invitation.phone.includes(searchTerm) ||
          invitation.className?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (invitation) => invitation.type === typeFilter
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (invitation) => invitation.status === statusFilter
      );
    }

    setFilteredInvitations(filtered);
  }, [invitations, searchTerm, typeFilter, statusFilter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleInvitationClick = (invitation) => {
    setSelectedInvitation(invitation);
    setOpenInvitationDialog(true);
  };

  const handleExtendInvitation = (invitationId, days) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (invitation) {
      const newExpiresAt = new Date(invitation.expiresAt);
      newExpiresAt.setDate(newExpiresAt.getDate() + days);

      setInvitations(
        invitations.map((inv) =>
          inv.id === invitationId
            ? {
                ...inv,
                expiresAt: newExpiresAt
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19),
              }
            : inv
        )
      );
      setSnackbar({
        open: true,
        message: `Gia hạn lời mời thành công thêm ${days} ngày!`,
        severity: "success",
      });
    }
  };

  const handleCancelInvitation = (invitationId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lời mời này?")) {
      setInvitations(
        invitations.map((inv) =>
          inv.id === invitationId ? { ...inv, status: "cancelled" } : inv
        )
      );
      setSnackbar({
        open: true,
        message: "Hủy lời mời thành công!",
        severity: "success",
      });
    }
  };

  const handleAddInvitation = () => {
    const newInvitationWithId = {
      ...newInvitation,
      id: Date.now(),
      code: `INV-2024-${String(Date.now()).slice(-6)}`,
      createdBy: "Admin",
      createdAt: new Date().toLocaleString(),
      expiresAt: new Date(
        Date.now() + newInvitation.expiresIn * 24 * 60 * 60 * 1000
      ).toLocaleString(),
      status: "active",
      usedBy: null,
      usedAt: null,
      currentUses: 0,
    };
    setInvitations([...invitations, newInvitationWithId]);
    setNewInvitation({
      type: "student",
      email: "",
      phone: "",
      classId: "",
      className: "",
      description: "",
      maxUses: 1,
      expiresIn: 7,
    });
    setOpenAddInvitationDialog(false);
    setSnackbar({
      open: true,
      message: "Tạo lời mời mới thành công!",
      severity: "success",
    });
  };

  const copyInvitationLink = (code) => {
    const link = `${window.location.origin}/setup-account/${code}`;
    navigator.clipboard.writeText(link);
    setSnackbar({
      open: true,
      message: "Đã sao chép link lời mời!",
      severity: "success",
    });
  };

  const getTypeColor = (type) => {
    return invitationTypes.find((t) => t.value === type)?.color || "default";
  };

  const getTypeLabel = (type) => {
    return invitationTypes.find((t) => t.value === type)?.label || type;
  };

  const getStatusColor = (status) => {
    return (
      invitationStatuses.find((s) => s.value === status)?.color || "default"
    );
  };

  const getStatusLabel = (status) => {
    return invitationStatuses.find((s) => s.value === status)?.label || status;
  };

  const isExpiringSoon = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffHours = (expiry - now) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const renderInvitationsTable = () => (
    <TableContainer component={Paper} elevation={2} className="rounded-xl">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell className="font-semibold">Mã lời mời</TableCell>
            <TableCell className="font-semibold">Loại</TableCell>
            <TableCell className="font-semibold">Người được mời</TableCell>
            <TableCell className="font-semibold">Lớp học</TableCell>
            <TableCell className="font-semibold">Trạng thái</TableCell>
            <TableCell className="font-semibold">Hết hạn</TableCell>
            <TableCell className="font-semibold">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInvitations.map((invitation) => (
            <TableRow key={invitation.id} className="hover:bg-gray-50">
              <TableCell>
                <Box>
                  <Typography variant="body2" className="font-medium">
                    {invitation.code}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tạo bởi: {invitation.createdBy}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getTypeLabel(invitation.type)}
                  color={getTypeColor(invitation.type)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{invitation.email}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {invitation.phone}
                </Typography>
              </TableCell>
              <TableCell>
                {invitation.className ? (
                  <Typography variant="body2">
                    {invitation.className}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Không có
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Box className="flex items-center space-x-2">
                  <Chip
                    label={getStatusLabel(invitation.status)}
                    color={getStatusColor(invitation.status)}
                    size="small"
                  />
                  {invitation.usedBy && (
                    <Tooltip title={`Đã sử dụng bởi: ${invitation.usedBy}`}>
                      <CheckCircle fontSize="small" color="success" />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{invitation.expiresAt}</Typography>
                {isExpiringSoon(invitation.expiresAt) && (
                  <Chip
                    label="Sắp hết hạn"
                    color="warning"
                    size="small"
                    className="mt-1"
                  />
                )}
                {isExpired(invitation.expiresAt) && (
                  <Chip
                    label="Đã hết hạn"
                    color="error"
                    size="small"
                    className="mt-1"
                  />
                )}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => handleInvitationClick(invitation)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sao chép link">
                    <IconButton
                      size="small"
                      onClick={() => copyInvitationLink(invitation.code)}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                  {invitation.status === "active" && (
                    <>
                      <Tooltip title="Gia hạn 7 ngày">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            handleExtendInvitation(invitation.id, 7)
                          }
                        >
                          {/* <Extend /> */}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hủy lời mời">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleCancelInvitation(invitation.id)}
                        >
                          <Cancel />
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

  const renderInvitationsCards = () => (
    <Grid container spacing={3}>
      {filteredInvitations.map((invitation) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={invitation.id}>
          <Card
            elevation={2}
            className="rounded-xl hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <Box className="flex items-start justify-between mb-3">
                <Box>
                  <Typography variant="h6" className="font-semibold">
                    {invitation.code}
                  </Typography>
                  <Chip
                    label={getTypeLabel(invitation.type)}
                    color={getTypeColor(invitation.type)}
                    size="small"
                    className="mt-1"
                  />
                </Box>
                <Chip
                  label={getStatusLabel(invitation.status)}
                  color={getStatusColor(invitation.status)}
                  size="small"
                />
              </Box>

              <Stack spacing={1} className="mb-3">
                <Box className="flex items-center space-x-2">
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2" className="truncate">
                    {invitation.email}
                  </Typography>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">{invitation.phone}</Typography>
                </Box>
                {invitation.className && (
                  <Box className="flex items-center space-x-2">
                    <SchoolIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {invitation.className}
                    </Typography>
                  </Box>
                )}
                <Box className="flex items-center space-x-2">
                  <Timer fontSize="small" color="action" />
                  <Typography variant="body2">
                    Hết hạn: {invitation.expiresAt}
                  </Typography>
                </Box>
              </Stack>

              {isExpiringSoon(invitation.expiresAt) && (
                <Alert severity="warning" className="mb-3">
                  Sắp hết hạn!
                </Alert>
              )}

              {invitation.usedBy && (
                <Box className="mb-3 p-2 bg-green-50 rounded-lg">
                  <Typography variant="caption" color="success.main">
                    Đã sử dụng bởi: {invitation.usedBy}
                  </Typography>
                </Box>
              )}

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleInvitationClick(invitation)}
                  fullWidth
                >
                  Chi tiết
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopy />}
                  onClick={() => copyInvitationLink(invitation.code)}
                  fullWidth
                >
                  Copy
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
          Quản lý lời mời
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Quản lý tất cả lời mời tham gia hệ thống, theo dõi trạng thái và gia
          hạn
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
                  <Mail />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {invitations.filter((i) => i.status === "active").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Lời mời đang mở
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
                  <Timer />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {
                      invitations.filter((i) => isExpiringSoon(i.expiresAt))
                        .length
                    }
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Sắp hết hạn
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {invitations.filter((i) => i.status === "used").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Đã sử dụng
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
                  {/* <Expire /> */}
                </Avatar>
                <Box>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {invitations.filter((i) => i.status === "expired").length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Đã hết hạn
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
                placeholder="Tìm kiếm theo mã, email, lớp học..."
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
                  {invitationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
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
                  {invitationStatuses.map((status) => (
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
                  onClick={() => setOpenAddInvitationDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Tạo lời mời
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <Box className="mb-4">
        <Typography variant="body2" color="textSecondary">
          Hiển thị {filteredInvitations.length} trong tổng số{" "}
          {invitations.length} lời mời
        </Typography>
      </Box>

      {/* Invitations List */}
      {viewMode === "table"
        ? renderInvitationsTable()
        : renderInvitationsCards()}

      {/* Invitation Detail Dialog */}
      <Dialog
        open={openInvitationDialog}
        onClose={() => setOpenInvitationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết lời mời
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          {selectedInvitation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mã lời mời"
                  fullWidth
                  value={selectedInvitation.code}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Loại"
                  fullWidth
                  value={getTypeLabel(selectedInvitation.type)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={selectedInvitation.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  value={selectedInvitation.phone}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lớp học"
                  fullWidth
                  value={selectedInvitation.className || "Không có"}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Trạng thái"
                  fullWidth
                  value={getStatusLabel(selectedInvitation.status)}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Người tạo"
                  fullWidth
                  value={selectedInvitation.createdBy}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Thời gian tạo"
                  fullWidth
                  value={selectedInvitation.createdAt}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Hết hạn"
                  fullWidth
                  value={selectedInvitation.expiresAt}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Số lần sử dụng"
                  fullWidth
                  value={`${selectedInvitation.currentUses}/${selectedInvitation.maxUses}`}
                  disabled
                />
              </Grid>
              {selectedInvitation.usedBy && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Người sử dụng"
                      fullWidth
                      value={selectedInvitation.usedBy}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Thời gian sử dụng"
                      fullWidth
                      value={selectedInvitation.usedAt}
                      disabled
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  label="Mô tả"
                  fullWidth
                  multiline
                  rows={3}
                  value={selectedInvitation.description}
                  disabled
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenInvitationDialog(false)}
            color="secondary"
          >
            Đóng
          </Button>
          {selectedInvitation && selectedInvitation.status === "active" && (
            <>
              <Button
                onClick={() => {
                  handleExtendInvitation(selectedInvitation.id, 7);
                  setOpenInvitationDialog(false);
                }}
                variant="contained"
                color="info"
              >
                Gia hạn 7 ngày
              </Button>
              <Button
                onClick={() => {
                  handleCancelInvitation(selectedInvitation.id);
                  setOpenInvitationDialog(false);
                }}
                variant="contained"
                color="error"
              >
                Hủy lời mời
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Add Invitation Dialog */}
      <Dialog
        open={openAddInvitationDialog}
        onClose={() => setOpenAddInvitationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Tạo lời mời mới
        </DialogTitle>
        <DialogContent className="space-y-4 p-6">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Loại lời mời</InputLabel>
                <Select
                  value={newInvitation.type}
                  onChange={(e) =>
                    setNewInvitation({ ...newInvitation, type: e.target.value })
                  }
                  label="Loại lời mời"
                >
                  {invitationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Số ngày có hiệu lực"
                fullWidth
                type="number"
                value={newInvitation.expiresIn}
                onChange={(e) =>
                  setNewInvitation({
                    ...newInvitation,
                    expiresIn: parseInt(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                value={newInvitation.email}
                onChange={(e) =>
                  setNewInvitation({ ...newInvitation, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Số điện thoại"
                fullWidth
                value={newInvitation.phone}
                onChange={(e) =>
                  setNewInvitation({ ...newInvitation, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mã lớp học (tùy chọn)"
                fullWidth
                value={newInvitation.classId}
                onChange={(e) =>
                  setNewInvitation({
                    ...newInvitation,
                    classId: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tên lớp học (tùy chọn)"
                fullWidth
                value={newInvitation.className}
                onChange={(e) =>
                  setNewInvitation({
                    ...newInvitation,
                    className: e.target.value,
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
                value={newInvitation.description}
                onChange={(e) =>
                  setNewInvitation({
                    ...newInvitation,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-6">
          <Button
            onClick={() => setOpenAddInvitationDialog(false)}
            color="secondary"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddInvitation}
            variant="contained"
            color="primary"
          >
            Tạo lời mời
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

export default InvitationManagementTab;
