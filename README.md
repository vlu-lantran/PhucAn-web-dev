# 🛍️ Phuc An Website – Docker Compose Setup

Dự án bao gồm 3 phần chính:

- **Server (Backend)**: Python (Flask/FastAPI) tại thư mục `Server/`, chạy ở cổng `3000`
- **Giao diện Admin**: tại thư mục `client-admin/`, chạy ở cổng `3001`
- **Giao diện Khách hàng**: tại thư mục `client-customer/`, chạy ở cổng `3002`

Tất cả được đóng gói và khởi chạy thông qua Docker Compose.

---

##  Hướng dẫn chạy dự án

### 1. Cài đặt yêu cầu
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)


### 2. Clone repository

```bash
git clone https://github.com/vlu-lantran/PhucAn-web-dev.git
cd landing_pages_new

docker-compose up --build
```

### 3. Khởi động toàn bộ hệ thống
```bash
docker-compose up --build
```
### 4.Truy cập hệ thống

| Thành phần      | URL                                            |
| --------------- | ---------------------------------------------- |
| Backend API     | [http://localhost:3000](http://localhost:3000) |
| Giao diện Admin | [http://localhost:3001](http://localhost:3001) |
| Giao diện Khách | [http://localhost:3002](http://localhost:3002) |

### 5. Để dừng hệ thống
```bash
docker-compose down
```