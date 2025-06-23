FROM node:18 AS builder
WORKDIR /app
COPY client-customer ./  
RUN npm install
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

FROM nginx:alpine

# Copy file build React
COPY --from=builder /app/build /usr/share/nginx/html

# Copy template Nginx và entrypoint
COPY ../nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY ../nginx/docker-entrypoint.sh /docker-entrypoint.sh

# Cấp quyền thực thi cho script
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Sử dụng entrypoint để thay env rồi mới chạy nginx
CMD ["/docker-entrypoint.sh"]
