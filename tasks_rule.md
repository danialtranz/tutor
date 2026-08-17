Danh sách Task Chi Tiết & Enrich Toàn Diện — Thành viên 6 (Frontend Xác Thực & Admin)
📊 1. BẢNG MÁP ỨNG TỔNG HỢP (FR / NFR / UC / ENT / PER MAPPING)
Hạng mục Mã tham chiếu trích xuất từ tài liệu & ảnh Phạm vi áp dụng trong Tasklist Thành viên 6
Xác thực & Phân quyền FR-AUTH-01 -> FR-AUTH-11
UC-AUTH-01, UC-AUTH-02, UC-AUTH-03
ENT-01 (User), ENT-02 (Role), ENT-03 (RefreshToken), ENT-04 (StudentProfile), ENT-05 (TutorProfile) S1-19 (Giao diện Xác thực & Authorization Routing)
Nền tảng & Component dùng chung SCP-IN-01
NFR-SEC-04, NFR-TIME-01, NFR-TIME-02, NFR-REL-03, NFR-UX-01, NFR-UX-02, NFR-UX-03, NFR-COMP-01
ENT-23 (Notification) S1-20 (Design System & Common Components Shell)
Giao diện Quản trị viên (Admin UI) FR-TUTOR-05 -> 10, FR-SUB-01 -> 03, FR-CMP-04 -> 07, FR-USER-06, FR-AUTH-09, FR-ADM-01 -> 07
UC-TUT-02, UC-SUB-01, UC-CMP-02, UC-ADM-01
NFR-SEC-05, NFR-PERF-02, NFR-PERF-03, NFR-DATA-02, NFR-PRIV-01 S1-21 (Khung & Giao diện Trang Quản trị Admin)
Tích hợp API & Logic Nghiệp vụ Admin UC-TUT-02, UC-SUB-01, UC-CMP-02, UC-ADM-01
ENT-06 (TutorApplication), ENT-07 (TutorDocument), ENT-08 (Subject), ENT-20 (Complaint), ENT-21 (Evidence), ENT-22 (ComplaintHistory), ENT-24 (AuditLog)
NFR-SEC-01, NFR-REL-03, NFR-MNT-02 S1-22 (Tích hợp API & Xử lý Luồng Nghiệp vụ Admin)
📌 CARD 1: S1-19 — Khởi tạo Frontend, Router và Xác thực phía giao diện
Nhãn: Frontend, Ưu tiên cao | Phân quyền: PER-01
Mã Use Case liên quan: UC-AUTH-01, UC-AUTH-02, UC-AUTH-03
Mã NFR liên quan: NFR-SEC-01, NFR-SEC-02, NFR-SEC-03, NFR-SEC-04, NFR-TIME-02, NFR-REL-03, NFR-UX-01, NFR-MNT-02, NFR-COMP-01
Entities liên quan: ENT-01 (User), ENT-02 (Role), ENT-03 (RefreshToken), ENT-04 (StudentProfile), ENT-05 (TutorProfile)

Checklist Chi Tiết & Quy Tắc Nghiệp Vụ:

1.  Khởi tạo dự án & Cấu hình môi trường (NFR-MNT-02, NFR-COMP-01)

Khởi tạo React + TypeScript (Vite/Next.js), .env (VITE_API_BASE_URL với prefix /api/v1/).
Đảm bảo ứng dụng chạy tương thích hoàn toàn trên Chrome & Edge phiên bản hiện hành (NFR-COMP-01). 2. Cấu hình Axios & Tự động Refresh Token (NFR-SEC-01, NFR-SEC-03, NFR-REL-03, UC-AUTH-03)

Request Interceptor: Tự động đính kèm Authorization: Bearer <access_token> vào header request đối với các endpoint bảo vệ (NFR-SEC-01).
Response Interceptor:
Xử lý mã lỗi chuẩn từ server (NFR-REL-03). Bắt lỗi 401 Unauthorized.
Nếu access token hết hạn: Tự động gọi API refresh token (FR-AUTH-04, ENT-03) gửi refresh_token để nhận access token mới và retry lại request bị lỗi trước đó.
Nếu refresh_token bị hết hạn (ExpiresUtc) hoặc đã bị thu hồi (RevokedUtc) (NFR-SEC-03): Xóa toàn bộ token khỏi client, chuyển hướng về trang /login kèm thông báo "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại" (NFR-UX-01).
Bảo mật log: Tuyệt đối không log thông tin mật khẩu rõ hoặc token nhạy cảm ra console.log ở môi trường production (NFR-SEC-02, NFR-OBS-01). 3. Trang Đăng nhập (FR-AUTH-03, UC-AUTH-03, ENT-01, ENT-02)

Đầu vào: Email / Username, Password.
Validation (Client-side - NFR-SEC-04): Kiểm tra định dạng Email hợp lệ, Mật khẩu không được để trống.
Nghịệp vụ & Xử lý ngoại lệ (UC-AUTH-03):
Khi submit: Gọi API đăng nhập POST /api/v1/auth/login.
Nếu thành công: Nhận cặp token (access_token, refresh_token), lưu token an toàn, lưu thông tin User (Id, Email, Role, Status, TimeZoneId) vào Auth Context.
Nếu tài khoản bị khóa (Status = Locked): Hiển thị thông báo lỗi rõ ràng "Tài khoản của bạn đã bị khóa bởi Quản trị viên" (NFR-UX-01).
Sai thông tin đăng nhập: Hiển thị lỗi "Email hoặc mật khẩu không chính xác". 4. Trang Đăng ký Học viên (FR-AUTH-01, UC-AUTH-01, ENT-04)

Đầu vào: Họ tên, Email, Mật khẩu, Nhập lại mật khẩu, Số điện thoại, Trình độ/Lớp (GradeLevel), Nhu cầu học tập (LearningNeeds).
Validation (NFR-SEC-04): Mật khẩu tối thiểu theo chính sách, kiểm tra mật khẩu nhập lại trùng khớp, email đúng chuẩn.
Nghịệp vụ (UC-AUTH-01): Gọi API POST /api/v1/auth/register/student. Tạo bản ghi User (ENT-01) và StudentProfile (ENT-04).
Ngoại lệ: Nếu Email đã tồn tại trong hệ thống -> Trả lỗi cụ thể "Email này đã được sử dụng". 5. Trang Đăng ký Gia sư (FR-AUTH-02, UC-AUTH-02, ENT-05)

Đầu vào: Họ tên, Email, Mật khẩu, Số điện thoại, Giới thiệu bản thân (Bio), Bằng cấp (Qualification), Kinh nghiệm (Experience).
Nghịệp vụ (UC-AUTH-02): Gọi API POST /api/v1/auth/register/tutor. Tạo bản ghi User và TutorProfile (ENT-05) với trạng thái duyệt ban đầu là Draft / Pending.
Lưu ý nghiệp vụ: Tài khoản Gia sư mới khởi tạo ở trạng thái chưa được duyệt sẽ chưa được xuất hiện trên kết quả tìm kiếm/đặt lịch của Student (FR-TUTOR-12). 6. Giao diện Quên / Đặt lại mật khẩu (FR-AUTH-07)

Giao diện yêu cầu gửi mã/token reset qua Email -> Giao diện nhập mật khẩu mới xác nhận bằng reset token. 7. Giao diện Đổi mật khẩu (FR-AUTH-06, NFR-SEC-02)

Form thay đổi mật khẩu dành cho người dùng đã đăng nhập: Yêu cầu xác thực mật khẩu hiện tại đúng mới cho phép đổi mật khẩu mới. 8. Quản lý trạng thái Auth Context & Lấy thông tin User (FR-AUTH-11, ENT-01)

Khi load lại ứng dụng (F5): Tự động gọi API GET /api/v1/auth/me để cập nhật thông tin user, role (Student, Tutor, Admin), status và múi giờ (TimeZoneId). 9. Protected Route & Role-based Routing (FR-AUTH-08, NFR-SEC-01)

ProtectedRoute: Ngăn chặn truy cập chưa đăng nhập -> Chuyển sang /login.
RoleBasedRoute: Kiểm tra vai trò người dùng. Nếu Student hoặc Tutor cố tình gõ đường dẫn /admin/\* -> Chuyển hướng ngay tới trang 403 Unauthorized (FR-AUTH-10, NFR-UX-01). 10. Trang Không có quyền truy cập (403 Unauthorized)

Giao diện báo lỗi phân quyền rõ ràng kèm nút "Quay lại trang chủ" hoặc nút "Đăng nhập lại bằng tài khoản Admin".
📌 CARD 2: S1-20 — Xây dựng thành phần giao diện dùng chung (Common UI Components)
Nhãn: Frontend | Phạm vi hệ thống: SCP-IN-01
Mã NFR liên quan: NFR-SEC-04, NFR-TIME-01, NFR-TIME-02, NFR-PERF-03, NFR-REL-03, NFR-UX-01, NFR-UX-02, NFR-UX-03, NFR-COMP-01
Entities liên quan: ENT-23 (Notification)

Checklist Chi Tiết & Quy Tắc UI/UX:

1.  App Layout Base & Responsive Shell (SCP-IN-01, NFR-COMP-01)

Khung Layout chuẩn responsive hỗ trợ Sidebar thu gọn/mở rộng, Header cố định, Main Content điều chỉnh phù hợp màn hình Desktop & Tablet/Mobile. 2. Header Component (PER-01)

Hiển thị Logo hệ thống, Avatar, Tên người dùng đang đăng nhập, Nút Đăng xuất (FR-AUTH-05).
Chuông thông báo (Notification Bell): Hiển thị số lượng thông báo chưa đọc (ENT-23). 3. Sidebar Component (Phân quyền động theo Role - FR-AUTH-08)

Tự động thay đổi danh mục Menu dựa theo vai trò (Student, Tutor, Admin).
Với Admin (PER-18): Hiển thị menu Dashboard, Duyệt gia sư, Quản lý môn học, Quản lý khiếu nại, Quản lý người dùng. 4. Control Form Components (Design System Base)

Button: Hỗ trợ trạng thái Primary, Secondary, Danger, Outline. Bắt buộc có Loading State (vô hiệu hóa nút và hiện spinner khi đang gửi request API để tránh bấm trùng - NFR-UX-01).
Input Component: Hỗ trợ xem/ẩn mật khẩu, hiển thị văn bản lỗi inline trực tiếp ngay dưới chân ô nhập (NFR-UX-01).
Select / Dropdown: Single select, Multi-select có ô tìm kiếm.
Date Picker & Time Picker (NFR-TIME-01, NFR-TIME-02): Định dạng ngày giờ chuẩn ISO 8601 (UTC/Offset), đồng nhất múi giờ hiển thị theo TimeZoneId của người dùng. 5. Data Display Components

Table Component (NFR-PERF-03): Bảng dữ liệu hỗ trợ phân trang Server-side (trang hiện tại, tổng số trang, số phần tử/trang), nút chuyển trang, cột sắp xếp (Sorting), hiển thị chỉ số dòng.
Modal / Dialog Base: Hộp thoại nổi dùng chung, hỗ trợ phím ESC để đóng, lớp phủ overlay mờ.
Confirm Dialog (NFR-UX-03): Hộp thoại xác nhận 2 bước đối với các hành động nguy hiểm (Từ chối duyệt gia sư, Khóa tài khoản người dùng, Khóa môn học) để tránh thao tác nhầm một bước. 6. Feedback & State Components

Toast Notification (NFR-REL-03, NFR-UX-01): Hiển thị thông báo Nổi (Success, Error, Warning, Info). Lỗi API phải đọc mã lỗi (code) và thông điệp lỗi (message) chuẩn để hiển thị cho người dùng.
Loading Spinner / Skeleton: Trạng thái chờ khi đang gọi API tải dữ liệu.
Empty State Component (NFR-UX-02): Trạng thái hiển thị trực quan khi danh sách/bảng không có dữ liệu (hình ảnh minh họa + câu thông báo "Chưa có dữ liệu"). Không được để giao diện trắng hoặc bị vỡ layout khi dữ liệu rỗng.
Error State Component: Hiển thị khi bị lỗi tải trang kèm nút "Tải lại trang".
📌 CARD 3: S1-21 — Xây dựng khung giao diện & các trang Quản trị viên (Admin UI)
Nhãn: Frontend | Phân quyền: PER-04, PER-05, PER-17, PER-18
Mã Use Case liên quan: UC-TUT-02, UC-SUB-01, UC-CMP-02, UC-ADM-01
Mã NFR liên quan: NFR-SEC-05, NFR-PERF-02, NFR-PERF-03, NFR-DATA-02, NFR-UX-02, NFR-UX-03, NFR-PRIV-01
Entities liên quan: ENT-05 (TutorProfile), ENT-06 (TutorApplication), ENT-07 (TutorDocument), ENT-08 (Subject), ENT-20 (Complaint), ENT-21 (Evidence), ENT-22 (ComplaintHistory), ENT-24 (AuditLog)

Checklist Chi Tiết & Quy Tắc UI Layout:

1.  Routing & Shell Admin (FR-AUTH-08, PER-18)

Cấu hình các Sub-routes cho Admin: /admin/dashboard, /admin/tutor-applications, /admin/tutor-applications/:id, /admin/subjects, /admin/complaints, /admin/users. 2. Trang Dashboard Thống Kê Admin (FR-ADM-01 -> FR-ADM-07, UC-ADM-01, NFR-PERF-02, NFR-UX-02)

Bộ lọc khoảng thời gian (FR-ADM-07): Picker cho phép chọn khoảng ngày (Ngày/Tuần/Tháng hoặc tùy chọn). Khi đổi ngày, toàn bộ KPI và biểu đồ tự động cập nhật theo phạm vi đó.
Các thẻ KPI (FR-ADM-01): Thống kê tổng số buổi học, Tỷ lệ hoàn thành goal học tập, Số hồ sơ gia sư đang chờ duyệt, Số khiếu nại chưa xử lý.
Biểu đồ Thống kê Buổi học (FR-ADM-02): Biểu đồ cột/đường hiển thị số buổi học theo trạng thái (Pending, Confirmed, Completed, Cancelled).
Biểu đồ Môn học Phổ biến (FR-ADM-03): Xếp hạng danh mục Subject theo số lượng buổi học đã diễn ra.
Biểu đồ Tỷ lệ Hoàn thành Mục tiêu (FR-ADM-04): Biểu đồ tròn/thanh hiển thị tỷ lệ Goal học tập đạt trạng thái Completed.
Thiết kế UX/UI (NFR-UX-02): Tất cả biểu đồ có nhãn thời gian, chú thích giá trị rõ ràng. Nếu không có dữ liệu trong khoảng thời gian chọn, phải hiển thị Empty State/giá trị 0, không được phát sinh lỗi crash UI (UC-ADM-01). Tải dữ liệu biểu đồ tối ưu dưới 1.5 giây (NFR-PERF-02). 3. Trang Quản lý & Duyệt Hồ sơ Gia sư (FR-TUTOR-05 -> 10, UC-TUT-02, ENT-06, ENT-07)

Danh sách hồ sơ (FR-TUTOR-05): Bảng phân trang Server-side (NFR-PERF-03), lọc theo trạng thái (Pending, Approved, Rejected, Suspended), tìm kiếm theo tên gia sư.
Trang Chi tiết hồ sơ (FR-TUTOR-06, ENT-07, NFR-PRIV-01): Xem thông tin chuyên môn, kinh nghiệm, bằng cấp và xem/tải các tệp tài liệu minh chứng (TutorDocument). Xem đường dẫn xem tệp an toàn (NFR-SEC-05).
Nút Thao tác & Modal Xác nhận (FR-TUTOR-07 -> 10, NFR-UX-03):
Nút Duyệt (Approve): Xác nhận chấp thuận hồ sơ -> Hồ sơ chuyển Approved, Gia sư bắt đầu được xuất hiện trên kết quả tìm kiếm (FR-TUTOR-07, ENT-05).
Nút Từ chối (Reject): Bắt buộc mở Modal yêu cầu nhập Lý do từ chối (không được để trống) (FR-TUTOR-08). Hồ sơ chuyển Rejected.
Nút Yêu cầu bổ sung (Request Update): Mở Modal nhập ghi chú yêu cầu Gia sư bổ sung giấy tờ (FR-TUTOR-09).
Nút Đình chỉ / Khôi phục (Suspend/Reactivate): Đổi trạng thái hoạt động của Gia sư (FR-TUTOR-10). 4. Trang Quản lý Môn học (FR-SUB-01, 02, 03, UC-SUB-01, ENT-08, NFR-DATA-02)

Danh sách Môn học: Bảng hiển thị Mã môn (Code), Tên môn (Name), Mô tả (Description), Trạng thái (Status: Active/Inactive).
Modal Thêm mới Môn học (FR-SUB-01): Form nhập Mã môn, Tên môn, Mô tả. Validation Client & Server không cho phép trùng Mã hoặc Tên môn học (UC-SUB-01).
Modal Cập nhật Môn học (FR-SUB-02): Form chỉnh sửa tên và mô tả môn học.
Khóa / Mở khóa Môn học (FR-SUB-03, NFR-DATA-02): Chuyển đổi trạng thái Active <-> Inactive. Quy tắc nghiệp vụ: Nếu môn học đang được tham chiếu bởi các buổi học/cấu hình môn dạy, không được xóa vật lý (Physical Delete) mà chỉ cho phép chuyển sang trạng thái Khóa (Inactive) (UC-SUB-01, NFR-DATA-02). 5. Trang Quản lý & Xử lý Khiếu nại (FR-CMP-04 -> 07, UC-CMP-02, ENT-20, ENT-21, ENT-22)

Danh sách Khiếu nại (FR-CMP-04): Bảng dữ liệu phân trang, lọc theo Trạng thái (Open, In_Progress, Resolved, Rejected), Loại khiếu nại.
Chi tiết Khiếu nại (FR-CMP-05, ENT-21): Xem thông tin người khiếu nại, người bị khiếu nại, Booking liên quan, mô tả nội dung, danh sách bằng chứng đính kèm (FileUrl, FileType), và lịch sử các bước xử lý trước đó (ENT-22).
Form / Action Cập nhật Xử lý (FR-CMP-06, FR-CMP-07):
Chọn trạng thái giải quyết (Resolved / Rejected).
Nhập nội dung Kết luận & Hành động quản trị (bắt buộc nhập) (FR-CMP-07).
Báo lỗi nếu thao tác chuyển trạng thái không hợp lệ (Invalid Status Transition) (UC-CMP-02). 6. Trang Quản lý Người dùng hệ thống (FR-USER-06, FR-AUTH-09, ENT-01)

Danh sách Người dùng (FR-USER-06): Bảng hiển thị thông tin người dùng toàn hệ thống, bộ lọc theo Role (Student, Tutor, Admin), bộ lọc Trạng thái (Active, Locked), ô tìm kiếm Email/Tên.
Khóa / Mở khóa Tài khoản (FR-AUTH-09, NFR-UX-03): Button Khóa/Mở khóa kèm Modal xác nhận 2 bước + Nhập lý do khóa. Khi khóa, tài khoản đó sẽ lập tức bị từ chối truy cập ở lần xác thực tiếp theo (FR-AUTH-03).
📌 CARD 4: S1-22 — Tích hợp API & Hoàn thiện Chức năng Quản trị viên (Admin Integration)
Nhãn: Frontend, API Integration
Mã NFR liên quan: NFR-SEC-01, NFR-TIME-02, NFR-PERF-03, NFR-REL-03, NFR-MNT-02
Entities liên quan: ENT-06, ENT-07, ENT-08, ENT-20, ENT-21, ENT-22, ENT-24 (AuditLog)

Checklist Tích Hợp API & Đăng Ký Endpoint:

1.  Tích hợp API Dashboard Admin (FR-ADM-01 -> 07, UC-ADM-01)

GET /api/v1/admin/dashboard/kpi?fromDate=...&toDate=... -> Gọi dữ liệu thẻ KPI tổng quan.
GET /api/v1/admin/dashboard/booking-stats?fromDate=...&toDate=... -> Gọi dữ liệu biểu đồ buổi học (FR-ADM-02).
GET /api/v1/admin/dashboard/popular-subjects?fromDate=...&toDate=... -> Gọi danh sách môn học phổ biến (FR-ADM-03).
GET /api/v1/admin/dashboard/goal-completion-rate?fromDate=...&toDate=... -> Gọi tỷ lệ hoàn thành mục tiêu (FR-ADM-04).
GET /api/v1/admin/dashboard/tutor-stats & complaint-stats -> Lấy số liệu hồ sơ Tutor & Khiếu nại (FR-ADM-05, FR-ADM-06).
Xử lý Frontend: Gửi query params chuẩn ISO 8601 UTC (NFR-TIME-02). Khi API trả tập rỗng -> Hiển thị số 0 / biểu đồ trống, không được báo lỗi crash app (UC-ADM-01). 2. Tích hợp API Duyệt Hồ Sơ Gia Sư (FR-TUTOR-05 -> 10, UC-TUT-02, ENT-06, ENT-24)

GET /api/v1/admin/tutor-applications?page=1&pageSize=10&status=Pending&search=... -> Lấy danh sách hồ sơ phân trang (FR-TUTOR-05, NFR-PERF-03).
GET /api/v1/admin/tutor-applications/:id -> Lấy thông tin chi tiết hồ sơ & danh sách tệp minh chứng TutorDocument (FR-TUTOR-06, ENT-07).
PUT /api/v1/admin/tutor-applications/:id/approve -> Duyệt chấp thuận hồ sơ gia sư (FR-TUTOR-07). Tạo ghi nhận AuditLog (ENT-24).
PUT /api/v1/admin/tutor-applications/:id/reject -> Trả body { "reason": "Lý do..." } để từ chối hồ sơ (FR-TUTOR-08).
PUT /api/v1/admin/tutor-applications/:id/request-update -> Trả body { "note": "Cần bổ sung..." } để yêu cầu sửa đổi (FR-TUTOR-09).
PUT /api/v1/admin/tutors/:id/suspend & /reactivate -> Đình chỉ hoặc khôi phục quyền gia sư (FR-TUTOR-10).
Xử lý Lỗi: Bắt lỗi nếu hồ sơ đã thay đổi trạng thái bởi Admin khác trước đó -> Thông báo Toast "Hồ sơ đã được xử lý bởi quản trị viên khác" (UC-TUT-02). 3. Tích hợp API Quản lý Môn Học (FR-SUB-01 -> 03, UC-SUB-01, ENT-08)

GET /api/v1/admin/subjects?page=1&pageSize=10&search=... -> Lấy danh sách môn học.
POST /api/v1/admin/subjects -> Body { "code": "MATH101", "name": "Toán 10", "description": "..." } để tạo môn mới (FR-SUB-01). Bắt lỗi 400/409 nếu Mã hoặc Tên bị trùng.
PUT /api/v1/admin/subjects/:id -> Cập nhật tên/mô tả môn học (FR-SUB-02).
PATCH /api/v1/admin/subjects/:id/status -> Body { "status": "Inactive" } để khóa môn học (FR-SUB-03, NFR-DATA-02). 4. Tích hợp API Xử lý Khiếu Nại (FR-CMP-04 -> 07, UC-CMP-02, ENT-20, ENT-21, ENT-22)

GET /api/v1/admin/complaints?page=1&pageSize=10&status=Open -> Danh sách khiếu nại phân trang (FR-CMP-04).
GET /api/v1/admin/complaints/:id -> Chi tiết khiếu nại, danh sách bằng chứng (ComplaintEvidence) và lịch sử xử lý (ComplaintHistory) (FR-CMP-05).
PUT /api/v1/admin/complaints/:id/status -> Cập nhật trạng thái nhận xử lý (In_Progress) (FR-CMP-06).
POST /api/v1/admin/complaints/:id/resolve -> Body { "resolution": "Nội dung kết luận...", "status": "Resolved" } để hoàn tất giải quyết khiếu nại (FR-CMP-07). 5. Tích hợp API Quản lý Người Dùng & Khóa Tài Khoản (FR-USER-06, FR-AUTH-09, ENT-01, ENT-24)

GET /api/v1/admin/users?page=1&pageSize=10&role=Student&status=Active&search=... -> Lấy danh sách người dùng (FR-USER-06).
PUT /api/v1/admin/users/:id/lock -> Body { "reason": "Vi phạm điều khoản" } để khóa tài khoản (FR-AUTH-09).
PUT /api/v1/admin/users/:id/unlock -> Mở khóa tài khoản.
Audit Log: Tự động lưu nhật ký thao tác Admin cho các hành động khóa/mở khóa tài khoản (ENT-24).
