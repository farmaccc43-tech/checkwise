# DeepGuard AI

Website frontend demo giúp người dùng tìm hiểu và nhận biết dấu hiệu lừa đảo.

## Chạy
Mở `index.html` bằng trình duyệt hoặc dùng VS Code Live Server.

## Lưu ý
Bản này có giao diện và mô phỏng phân tích ở frontend. Chưa kết nối DeepSeek API thật.

Nếu triển khai AI thật:
1. Tạo backend (Node.js/Python).
2. Lưu API key trong biến môi trường, tuyệt đối không để trong frontend.
3. Gửi text/metadata phù hợp từ frontend tới backend.
4. Với ảnh/audio/video, xử lý/đổi sang định dạng mà mô hình và backend hỗ trợ.
5. Luôn hiển thị kết quả như một đánh giá rủi ro, không phải kết luận tuyệt đối.

Không upload OTP, mật khẩu hoặc dữ liệu nhạy cảm.
