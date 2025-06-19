# Phuc An Website – Docker Compose Setup

Dự án bao gồm 3 phần chính:

- **Server (Backend)**: Python (Flask/FastAPI) tại thư mục `Server/`, chạy ở cổng `3000`
- **Giao diện Admin**: Giao diện quản lý, tại thư mục `client-admin/`, chạy ở cổng `3001`
- **Giao diện Khách hàng**: Giao diện khách hàng, tại thư mục `client-customer/`, chạy ở cổng `3002`

Triển khai bằng `Docker Compose`, đảm bảo dễ dàng cài đặt, quản lý và mở rộng.

---

## 🚀 Cách Khởi Động Hệ Thống

### 1. Cài đặt yêu cầu
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Hệ điều hành Windows, macOS hoặc Linux đều hỗ trợ

### 2. Các bước thực hiện

1. **Tải về mã nguồn** từ GitHub hoặc từ file nén
2. **Mở Terminal / CMD / PowerShell** tại thư mục gốc của dự án
3. **Chạy lệnh sau để khởi động toàn bộ hệ thống**

```bash
docker compose up --build
```
Lưu ý: Lần đầu khởi động sẽ mất vài phút để Docker tải ảnh và build container.

### 3. Truy cập hệ thống
Sau khi khởi động thành công, truy cập các đường dẫn sau:

| Thành phần      | URL                     |
| --------------- | ------------------------|
| Backend API     | [http://localhost:3000] |
| Giao diện Admin | [http://localhost:3001] |
| Giao diện Khách | [http://localhost:3002] |

### 4. Cấu hình môi trường

```bash
docker-compose down
```
