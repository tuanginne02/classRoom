# Classroom Project

## Backend (server/)

### Tổng quan

Đây là phần backend của hệ thống Classroom, sử dụng Node.js với Express, kết nối Firebase Realtime Database, hỗ trợ xác thực, quản lý người dùng, sinh viên, giáo viên, bài học, chat real-time, upload file, gửi email, và nhiều chức năng khác.

### Yêu cầu hệ thống

- Node.js >= 16.x
- Firebase Realtime Database (service account)
- Tài khoản email SMTP (cho gửi mail)
- Twilio (nếu dùng xác thực SMS)

### Cài đặt

```bash
cd server
npm install
```

### Cấu hình

Tạo file `.env` trong thư mục `server/` với các biến sau (ví dụ):

```
PORT=5000
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE=your_twilio_phone
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
```

**Lưu ý:**

- Đặt file `serviceAccountKey.json` (Firebase Admin SDK) vào thư mục `server/` (đã được .gitignore).
- Không commit file này lên GitHub.

### Chạy server

- Chạy production:
  ```bash
  npm start
  ```
- Chạy development (hot reload):
  ```bash
  npm run dev
  ```

### Scripts

- `npm start`: Chạy server bình thường
- `npm run dev`: Chạy server với nodemon (tự động reload khi thay đổi code)
- `npm run test`: Chạy test với Jest
- `npm run lint`: Kiểm tra code với ESLint
- `npm run lint:fix`: Sửa lỗi lint tự động

### Các thư mục/file chính

- `server.js`: File chính khởi động server Express
- `firebase.js`: Kết nối Firebase Admin SDK
- `data.js`: Các hàm truy vấn dữ liệu
- `uploads/`: Lưu file upload (ví dụ: bài tập, tài liệu)
- `utils.js`: Các hàm tiện ích

### Các API tiêu biểu

- `POST /addStudent`: Thêm sinh viên mới
- `POST /addInstructor`: Thêm giáo viên mới
- `GET /students`: Lấy danh sách sinh viên
- `GET /student/:phone`: Lấy thông tin chi tiết sinh viên
- `PUT /editStudent/:phone`: Sửa thông tin sinh viên
- `DELETE /student/:phone`: Xóa sinh viên
- `POST /assignLesson`: Giao bài cho sinh viên
- `POST /validateAccessCode`: Xác thực mã truy cập
- `POST /setRole`: Gán vai trò cho user
- `POST /submitAssignment`: Nộp bài tập
- ... và nhiều API khác (xem trong `server.js`)

### Realtime & Chat

- Sử dụng Socket.io cho chat 1-1, thông báo realtime, trạng thái online.

### Bảo mật

- Không commit file `.env`, `serviceAccountKey.json`, hoặc dữ liệu uploads lên GitHub.
- Đã có `.gitignore` bảo vệ các file này.

---

## Frontend (client/)

### Tổng quan

Đây là phần giao diện người dùng của hệ thống Classroom, xây dựng với React, sử dụng Vite, Material UI, Socket.io-client, và kết nối với backend qua REST API.

### Yêu cầu hệ thống

- Node.js >= 16.x

### Cài đặt

```bash
cd client
npm install
```

### Cấu hình

- Nếu cần, tạo file `.env` trong thư mục `client/` để cấu hình endpoint API, ví dụ:
  ```
  VITE_API_URL=http://localhost:5000
  ```
- Đảm bảo endpoint API đúng với backend.

### Chạy frontend

- Chạy development:
  ```bash
  npm run dev
  ```
- Build production:
  ```bash
  npm run build
  ```
- Xem thử bản build:
  ```bash
  npm run preview
  ```

### Scripts

- `npm run dev`: Chạy chế độ phát triển (hot reload)
- `npm run build`: Build production
- `npm run preview`: Xem thử bản build
- `npm run lint`: Kiểm tra code với ESLint

### Các thư mục/file chính

- `src/`: Chứa toàn bộ mã nguồn React
  - `components/`: Các component giao diện (Admin, Instructor, Student, Chat, ...)
  - `pages/`: Các trang chính (Dashboard, Login, Profile, ...)
  - `services/`: Các hàm gọi API backend (student, instructor, user, ...)
  - `hooks/`: Custom hooks (ví dụ: useAuth)
  - `assets/`: Ảnh, icon, ...
- `public/`: File tĩnh, favicon, ...
- `index.html`: File HTML gốc

### Các dependency chính

- `react`, `react-dom`: Thư viện React
- `@mui/material`, `@mui/icons-material`: Material UI cho giao diện
- `axios`: Gọi API
- `socket.io-client`: Kết nối realtime với backend
- `firebase`: (nếu dùng xác thực hoặc push notification phía client)
- `react-router-dom`: Routing
- `date-fns`: Xử lý ngày tháng
- `react-hot-toast`: Toast notification

### Chức năng nổi bật

- Đăng nhập, đăng ký, xác thực qua mã truy cập
- Quản lý sinh viên, giáo viên, lớp học
- Giao bài, nộp bài, xem tiến độ
- Chat realtime 1-1 giữa giáo viên và sinh viên
- Thống kê, quản lý hệ thống (Admin)
- Responsive UI, trải nghiệm hiện đại

### Bảo mật

- Không commit file `.env`, dữ liệu nhạy cảm, hoặc file build lên GitHub (đã có `.gitignore`).

---

Nếu bạn muốn README có ví dụ request/response API, hướng dẫn chi tiết hơn về cấu trúc code, hoặc bổ sung phần nào, hãy nói rõ nhé!
