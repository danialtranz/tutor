# Danh sách Task đầy đủ — Thành viên 6 (Frontend xác thực & Admin)

---

## 📌 Card 1: S1-19 — Khởi tạo Frontend, Router và xác thực phía giao diện
**Nhãn:** `Frontend`, `Ưu tiên cao`  
**Ghi chú:** Card này cần được ưu tiên và gộp sớm để Thành viên 4 và Thành viên 5 sử dụng chung.

### Checklist:
- [ ] Khởi tạo dự án React + TypeScript
- [ ] Cấu hình React Router
- [ ] Cấu hình Axios instance
- [ ] Cấu hình API base URL & biến môi trường (.env)
- [ ] Tạo trang đăng nhập
- [ ] Tạo trang đăng ký học viên
- [ ] Tạo trang đăng ký gia sư
- [ ] Lưu access token (LocalStorage / Cookie / State)
- [ ] Gắn token tự động vào request header (Axios Interceptors)
- [ ] Tạo Protected Route (kiểm tra trạng thái đăng nhập)
- [ ] Tạo Role-based Route (phân quyền Học viên / Gia sư / Admin)
- [ ] Tạo trang không có quyền truy cập (Unauthorized / 403 Page)
- [ ] Tích hợp API đăng ký (Học viên & Gia sư)
- [ ] Tích hợp API đăng nhập

---

## 📌 Card 2: S1-20 — Xây dựng thành phần giao diện dùng chung (Design System / Common Components)
**Nhãn:** `Frontend`

### Checklist:
- [ ] App Layout
- [ ] Header
- [ ] Sidebar
- [ ] Button (Primary, Secondary, Danger, Loading state...)
- [ ] Input (Text, Password, Number, Search...)
- [ ] Select / Dropdown
- [ ] Modal / Dialog Base
- [ ] Table (với phân trang, sort cơ bản)
- [ ] Loading Spinner / Skeleton
- [ ] Empty State
- [ ] Error State / Page 404
- [ ] Toast Notification
- [ ] Confirm Dialog (Xác nhận hành động quan trọng)
- [ ] Date Picker
- [ ] Time Picker

---

## 📌 Card 3: S1-21 — Xây dựng khung giao diện & các trang quản trị viên (Admin UI)
**Nhãn:** `Frontend`

### Checklist:
- [ ] Tạo route `/admin/dashboard`
- [ ] Tạo route `/admin/tutor-applications`
- [ ] Tạo route `/admin/subjects`
- [ ] Tạo route `/admin/complaints`
- [ ] Xây dựng Sidebar Admin
- [ ] Xây dựng trang Dashboard tổng quan (Giao diện thẻ thống kê & biểu đồ mẫu)
- [ ] Xây dựng trang danh sách hồ sơ gia sư chờ duyệt (Bảng danh sách, bộ lọc)
- [ ] Xây dựng trang chi tiết hồ sơ gia sư (Xem bằng cấp, thông tin cá nhân)
- [ ] Xây dựng nút / thao tác duyệt và từ chối hồ sơ gia sư
- [ ] Xây dựng trang danh sách môn học
- [ ] Xây dựng Modal / Form thêm mới môn học
- [ ] Xây dựng Modal / Form chỉnh sửa thông tin môn học
- [ ] Xây dựng trang danh sách khiếu nại (Bảng danh sách, trạng thái khiếu nại)
- [ ] Xây dựng Modal / Trang chi tiết khiếu nại & Form nhập nội dung xử lý khiếu nại

---

## 📌 Card 4: S1-22 — Tích hợp API & Hoàn thiện chức năng Quản trị viên (Admin API Integration)
**Nhãn:** `Frontend`, `API Integration`  
*(Bổ sung nhằm đảm bảo hoàn thiện 100% luồng dữ liệu cho Admin)*

### Checklist:
- [ ] Tích hợp API Dashboard: Lấy số liệu tổng quan & dữ liệu biểu đồ thống kê
- [ ] Tích hợp API Duyệt gia sư: Lấy danh sách hồ sơ gia sư chờ duyệt (phân trang, tìm kiếm)
- [ ] Tích hợp API Duyệt gia sư: Xem chi tiết hồ sơ gia sư
- [ ] Tích hợp API Duyệt gia sư: Gửi yêu cầu Duyệt / Từ chối hồ sơ gia sư
- [ ] Tích hợp API Quản lý môn học: Lấy danh sách môn học
- [ ] Tích hợp API Quản lý môn học: Thêm mới môn học
- [ ] Tích hợp API Quản lý môn học: Chỉnh sửa / Cập nhật trạng thái môn học
- [ ] Tích hợp API Quản lý môn học: Xóa / Ẩn môn học
- [ ] Tích hợp API Xử lý khiếu nại: Lấy danh sách khiếu nại (lọc theo trạng thái)
- [ ] Tích hợp API Xử lý khiếu nại: Lấy thông tin chi tiết khiếu nại
- [ ] Tích hợp API Xử lý khiếu nại: Gửi quyết định xử lý (Duyệt khiếu nại, Từ chối, Giải quyết)
