from flask import Flask, request, jsonify
from flask_cors import CORS
from api.admin import admin_bp
from api.customer import customer_bp

app = Flask(__name__)
CORS(app)  # Cho phép truy cập CORS nếu bạn gọi từ React

# Cấu hình tối đa payload nhận vào (tương tự body-parser limit)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB

# Test API
@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from server!'})

# Mount các blueprint (tương đương app.use trong Express)
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(customer_bp, url_prefix='/api/customer')
# Khởi động server
if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)
