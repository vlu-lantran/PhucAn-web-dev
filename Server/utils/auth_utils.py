import jwt
import datetime
from flask import request, jsonify
from functools import wraps
from .my_constants import MyConstants

# Tạo token
def gen_token(username, password):
    payload = {
        'username': username,
        'password': password,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(milliseconds=MyConstants.JWT_EXPIRES)
    }
    token = jwt.encode(payload, MyConstants.JWT_SECRET, algorithm='HS256')
    return token


# Kiểm tra token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization') or request.headers.get('x-access-token')

        if not token:
            return jsonify({'success': False, 'message': 'No token provided'}), 403

        # Loại bỏ 'Bearer ' nếu có
        if token.startswith('Bearer '):
            token = token[7:]

        try:
            data = jwt.decode(token, MyConstants.JWT_SECRET, algorithms=['HS256'])
            request.user = data  # Lưu thông tin giải mã vào request
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated

def check_token():
    token = request.headers.get('Authorization') or request.headers.get('x-access-token')

    if not token:
        return None, {'success': False, 'message': 'No token provided'}, 403

    if token.startswith('Bearer '):
        token = token[7:]

    try:
        data = jwt.decode(token, MyConstants.JWT_SECRET, algorithms=['HS256'])
        return data, None, 200
    except jwt.ExpiredSignatureError:
        return None, {'success': False, 'message': 'Token expired'}, 401
    except jwt.InvalidTokenError:
        return None, {'success': False, 'message': 'Invalid token'}, 401
