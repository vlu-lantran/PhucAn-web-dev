#!/bin/sh

# Ghi đè file cấu hình nginx với biến môi trường
envsubst '${REACT_APP_API_BASE_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Chạy nginx
nginx -g 'daemon off;'
