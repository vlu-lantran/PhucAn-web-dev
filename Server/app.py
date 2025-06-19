from flask import Flask, request, jsonify
from flask_cors import CORS
from api.admin import admin_bp
from api.customer import customer_bp
from dotenv import load_dotenv
import os

load_dotenv()  # Load biến môi trường từ file .env nếu có

app = Flask(__name__)

# Cấu hình CORS
CORS(app, resources={r"/*": {"origins": os.getenv("ALLOWED_ORIGINS", "*")}})

# Cấu hình payload tối đa
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv("MAX_CONTENT_LENGTH", 10)) * 1024 * 1024  # default 10MB

# Mount blueprint
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(customer_bp, url_prefix='/api/customer')

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from server!'})

# Khởi động server
if __name__ == '__main__':
    port = int(os.getenv("PORT", 3000))
    debug = os.getenv("DEBUG", "False").lower() == "true"
    app.run(host='0.0.0.0', port=port, debug=debug)
