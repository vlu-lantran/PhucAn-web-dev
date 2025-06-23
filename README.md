# Phuc An Website – Docker Compose Setup

Dự án bao gồm 3 phần chính:

- **Server (Backend)**: Python (Flask/FastAPI) tại thư mục `Server/`, chạy ở cổng `3000`
- **Giao diện Admin**: Giao diện quản lý, tại thư mục `client-admin/`, chạy ở cổng `3001`
- **Giao diện Khách hàng**: Giao diện khách hàng, tại thư mục `client-customer/`, chạy ở cổng `3002`

Triển khai bằng `Docker Compose`, đảm bảo dễ dàng cài đặt, quản lý và mở rộng.

---

## Cách Khởi Động Hệ Thống

### 1. Cài đặt yêu cầu
#### Clone dự án
```bash
git clone https://github.com/vlu-lantran/PhucAn-web-dev.git
cd vlu-lantran/PhucAn-wen-dev 
```
#### Cài Đặt Docker
- Đã cài đặt [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Hệ điều hành Windows, macOS hoặc Linux đều hỗ trợ

### 2. Các bước thực hiện
1. **Mở Terminal / CMD / PowerShell** tại thư mục gốc của dự án
2. **Chạy lệnh sau để khởi động toàn bộ hệ thống**

```bash
docker compose up --build
```
Lưu ý: Lần đầu khởi động sẽ mất vài phút để Docker tải ảnh và build container.

### 3. Cấu hình môi trường
mở file .env trong thư mục Server/ nếu cần kết nối DB hay cấu hình nội bộ 
```env
DB_USER=minhquan1627
DB_PASS=minhquan1627
DB_SERVER=cluster0.pmpo0.mongodb.net
DB_NAME=Database

# 👉 Dùng để build URI tự động trong code:
# mongodb+srv://<DB_USER>:<DB_PASS>@<DB_SERVER>/<DB_NAME>?retryWrites=true&w=majority
```

### 4. Build & chạy production

```bash
docker-compose build
docker-compose up -d
```

### 5. Truy cập vào website

| Dịch vụ          | Địa chỉ truy cập                                          |
| ---------------- | ----------------------------------------------------------|
| Backend API      | [http://localhost:3000]                                   |
| Customer Website | [http://localhost:3002]                                   |
| Admin Website    | [http://localhost:3001/admin/home]                        |

## Triển khai production thực tế

### Hướng dẫn chọn API URL theo từng môi trường
#### Truy cập vào file .env cùng cấp với docker-compose.yml

| Trường hợp                       | Biến cần dùng                                   |
| -------------------------------- | ----------------------------------------------- |
| Chạy bằng `docker-compose` local | `REACT_APP_API_BASE_URL=http://backend:3000`    |
| Chạy với domain + Nginx + SSL    | `REACT_APP_API_BASE_URL=https://api.domain.com` |

#### Ví dụ khi dùng domain thực:
Giả sử bạn đã trỏ:

https://admin.yourdomain.com → cổng 3001 (client-admin)

https://www.yourdomain.com → cổng 3002 (client-customer)

https://api.yourdomain.com → cổng 3000 (backend)

```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```
Sau khi chỉnh sửa .env, hãy build lại frontend:
```bash
docker compose down --volumes --remove-orphans
docker compose build --no-cache
docker compose up
```
