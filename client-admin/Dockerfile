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
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
