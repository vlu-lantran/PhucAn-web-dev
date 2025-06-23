# --- Giai đoạn build ---
FROM node:18 AS builder
WORKDIR /app

# Chỉ copy client-admin
COPY client-admin ./client-admin
WORKDIR /app/client-admin

# Cài đặt và build
RUN npm install
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

# --- Giai đoạn production ---
FROM nginx:alpine

# Copy build React admin vào đúng thư mục cho route /admin/home
COPY --from=builder /app/client-admin/build /usr/share/nginx/html/admin/home

# Copy file template và script thay biến môi trường
COPY ../nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY ../nginx/docker-entrypoint.sh /docker-entrypoint.sh

# Cấp quyền thực thi cho script
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Entrypoint để thay biến env và chạy nginx
CMD ["/docker-entrypoint.sh"]
