# Admin Dashboard Components

## Tổng quan

Admin Dashboard là hệ thống quản lý toàn diện cho việc quản trị hệ thống Classroom, bao gồm 8 module chính:

## 1. Quản lý người dùng (UserManagementTab)

### Tính năng:

- 📋 Danh sách người dùng với lọc theo role (Giáo viên, Học sinh, Admin)
- 🔍 Tìm kiếm theo tên, email, số điện thoại
- 👤 Xem chi tiết từng người dùng
- 🔄 Cập nhật thông tin (name, role, trạng thái)
- 🛑 Khóa/mở tài khoản
- 🔁 Đổi role (chuyển học sinh thành giáo viên nếu cần)

### Sử dụng:

- Chuyển đổi giữa chế độ xem bảng và thẻ
- Lọc theo vai trò và trạng thái
- Thêm người dùng mới
- Chỉnh sửa thông tin người dùng

## 2. Quản lý giáo viên (TeacherManagementTab)

### Tính năng:

- 🧑‍🏫 Danh sách giáo viên
- 📚 Số lớp mà giáo viên đang dạy
- 📊 Xem số lượng học sinh của mỗi giáo viên
- 📥 Xem lịch sử mời học sinh, số lượng lớp đã tạo
- ❌ Tạm ngưng hoặc thu hồi quyền tạo lớp nếu vi phạm

### Sử dụng:

- Xem thống kê giáo viên
- Quản lý quyền tạo lớp
- Tạm ngưng/kích hoạt giáo viên
- Thêm giáo viên mới

## 3. Quản lý lớp học (ClassManagementTab)

### Tính năng:

- 🏫 Danh sách tất cả lớp học
- 🔍 Tìm kiếm theo tên lớp, giáo viên, môn học
- 👀 Xem chi tiết lớp học (giáo viên, học sinh, thời gian tạo)
- 🛠 Sửa thông tin lớp học (nếu cần)
- 🗑 Xóa lớp học (có xác nhận)

### Sử dụng:

- Lọc theo môn học, lớp, trạng thái
- Xem tiến độ lớp học
- Quản lý thông tin lớp học

## 4. Phân quyền & vai trò (PermissionManagementTab)

### Tính năng:

- ➕ Tạo tài khoản admin mới
- 🧾 Gán hoặc thu hồi quyền giáo viên
- 🔁 Đặt vai trò đặc biệt (ví dụ: Moderator, Super Admin…)

### Sử dụng:

- Quản lý vai trò người dùng
- Cấp quyền chi tiết
- Tạo admin mới

## 5. Thống kê hệ thống (StatisticsTab)

### Tính năng:

- 📈 Tổng số người dùng
- 📊 Số lượng học sinh / giáo viên đang hoạt động
- 🧮 Số lớp học đang mở
- ⏱ Thời gian hoạt động trung bình
- ⚠️ Danh sách người dùng bị báo cáo / cần xem xét

### Sử dụng:

- Xem biểu đồ tăng trưởng
- Quản lý người dùng bị báo cáo
- Theo dõi hiệu suất hệ thống

## 6. Quản lý lỗi & báo cáo (ErrorManagementTab)

### Tính năng:

- 🚨 Xem danh sách sự cố (học sinh không vào được lớp, OTP không gửi…)
- 🧾 Xem feedback từ người dùng
- 🔄 Cập nhật trạng thái xử lý

### Sử dụng:

- Phân loại sự cố theo mức độ ưu tiên
- Xử lý feedback người dùng
- Theo dõi tiến độ xử lý

## 7. Cấu hình hệ thống (SystemConfigTab)

### Tính năng:

- 🌐 Cài đặt domain, email, liên kết hệ thống ngoài
- 🕹 Bật/tắt chức năng tạm thời (vd: tắt đăng ký lớp mới)
- 💬 Quản lý thông báo toàn hệ thống

### Sử dụng:

- Cấu hình SMTP email
- Quản lý tính năng hệ thống
- Tạo thông báo toàn hệ thống

## 8. Quản lý lời mời (InvitationManagementTab)

### Tính năng:

- 📬 Danh sách các lời mời đang mở
- ⏳ Lời mời sắp hết hạn
- ❌ Hủy hoặc gia hạn lời mời
- 🔐 Theo dõi ai đã dùng link mời

### Sử dụng:

- Tạo lời mời mới
- Gia hạn lời mời sắp hết hạn
- Theo dõi trạng thái sử dụng

## Cách sử dụng

### Đăng nhập Admin:

```
Email: admin@example.com
Phone: 9999999999
Username: admin
Password: (mật khẩu mẫu)
```

### Truy cập Admin Dashboard:

```
URL: /admin-dashboard
```

### Tính năng chung:

- **Sidebar Navigation**: Chuyển đổi giữa các module
- **Search & Filter**: Tìm kiếm và lọc dữ liệu
- **View Modes**: Chuyển đổi giữa bảng và thẻ
- **Responsive Design**: Hoạt động tốt trên mobile và desktop
- **Real-time Updates**: Cập nhật dữ liệu theo thời gian thực

## Cấu trúc thư mục

```
client/src/components/Admin/
├── UserManagementTab.jsx
├── TeacherManagementTab.jsx
├── ClassManagementTab.jsx
├── PermissionManagementTab.jsx
├── StatisticsTab.jsx
├── ErrorManagementTab.jsx
├── SystemConfigTab.jsx
├── InvitationManagementTab.jsx
└── README.md
```

## Lưu ý

- Tất cả dữ liệu hiện tại là mock data để demo
- Cần tích hợp với API backend thực tế
- Cần thêm xác thực và phân quyền chi tiết
- Cần thêm validation và error handling
- Cần tối ưu performance cho dữ liệu lớn
