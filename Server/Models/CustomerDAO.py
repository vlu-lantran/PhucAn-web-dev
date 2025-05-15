from bson import ObjectId
from mongoengine import DoesNotExist
from .Models import Customer
import datetime
from utils.db import get_db, connect_mongoengine

# Kết nối với MongoEngine
connect_mongoengine()

def to_dict(obj):
    """Chuyển MongoEngine document thành dict với _id dưới dạng string"""
    data = obj.to_mongo().to_dict()
    data['_id'] = str(data['_id'])
    return data

class CustomerDAO:
    @staticmethod
    def insert(customer_data):
        try:
            customer_data['_id'] = ObjectId()  # Đảm bảo có _id cho khách hàng mới
            customer_data['created_at'] = int(datetime.datetime.now().timestamp())
            customer_data['updated_at'] = int(datetime.datetime.now().timestamp())
            customer = Customer(**customer_data)
            customer.save()  # Lưu khách hàng vào MongoDB
            return to_dict(customer)
        except Exception as e:
            print(f"[ERROR] Insert customer failed: {str(e)}")
            return None

    @staticmethod
    def select_by_username_and_password(username, password):
        try:
            customer = Customer.objects.get(username=username, password=password)
            return to_dict(customer)
        except DoesNotExist:
            print(f"[ERROR] Invalid username or password: {username}")
            return None
        except Exception as e:
            print(f"[ERROR] Login failed: {str(e)}")
            return None

    @staticmethod
    def select_by_id(_id):
        try:
            customer = Customer.objects.get(id=ObjectId(_id))  # Tìm khách hàng theo _id
            return to_dict(customer)
        except DoesNotExist:
            print(f"[ERROR] Customer not found with ID: {_id}")
            return None
        except Exception as e:
            print(f"[ERROR] Select customer by ID failed: {str(e)}")
            return None

    @staticmethod
    def select_by_username(username):
        try:
            customer = Customer.objects.get(username=username)  # Tìm khách hàng theo username
            return to_dict(customer)
        except DoesNotExist:
            print(f"[ERROR] Customer not found with username: {username}")
            return None
        except Exception as e:
            print(f"[ERROR] Select customer by username failed: {str(e)}")
            return None

    @staticmethod
    def select_all():
        try:
            customers = Customer.objects()  # Lấy tất cả khách hàng
            return [to_dict(customer) for customer in customers]
        except Exception as e:
            print(f"[ERROR] Select all customers failed: {str(e)}")
            return []

    @staticmethod
    def update(_id, customer_data):
        try:
            customer = Customer.objects.get(id=ObjectId(_id))  # Tìm khách hàng theo _id
            customer.update(**customer_data)  # Cập nhật thông tin khách hàng
            customer.reload()  # Làm mới lại đối tượng khách hàng
            return to_dict(customer)
        except DoesNotExist:
            print(f"[ERROR] Customer not found with ID: {_id}")
            return None
        except Exception as e:
            print(f"[ERROR] Update customer failed: {str(e)}")
            return None

    @staticmethod
    def delete(_id):
        try:
            customer = Customer.objects.get(id=ObjectId(_id))  # Tìm khách hàng theo _id
            customer.delete()  # Xóa khách hàng
            return {"message": "Customer deleted successfully"}
        except DoesNotExist:
            print(f"[ERROR] Customer not found with ID: {_id}")
            return {"error": "Customer not found"}
        except Exception as e:
            print(f"[ERROR] Delete customer failed: {str(e)}")
            return {"error": str(e)}
