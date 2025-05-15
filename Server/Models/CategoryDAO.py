from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
from utils.db import get_db, connect_mongoengine
from .Models import Category
from datetime import datetime

connect_mongoengine()
# Hàm chuyển đổi ObjectId thành chuỗi
def convert_objectid_to_str(doc):
    # Nếu doc là một dictionary, chuyển tất cả ObjectId thành chuỗi
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)  # Chuyển ObjectId thành chuỗi
    return doc

class CategoryDAO:
    @staticmethod
    def select_all():
        db = get_db()
        categories = list(db.categories.find())  # Sử dụng find() với PyMongo
        # Chuyển ObjectId thành chuỗi trước khi trả về
        return [convert_objectid_to_str(cat) for cat in categories]

    @staticmethod
    def insert(category_data):
        db = get_db()
        category_data['_id'] = ObjectId()  # Thêm _id nếu chưa có
        result = db.categories.insert_one(category_data)
        return convert_objectid_to_str(category_data)  # Trả về dữ liệu vừa chèn, chuyển ObjectId thành chuỗi

    @staticmethod
    def update(category_data):
        db = get_db()
        category = db.categories.find_one({"_id": category_data['_id']})
        if category:
            db.categories.update_one({"_id": category_data['_id']}, {"$set": category_data})
        return convert_objectid_to_str(category_data)  # Trả về dữ liệu đã cập nhật

    @staticmethod
    def delete(_id):
        db = get_db()
        category = db.categories.find_one({"_id": _id})
        if category:
            db.categories.delete_one({"_id": _id})
        return convert_objectid_to_str(category)  # Trả về đối tượng đã bị xóa

    @staticmethod
    def select_by_id(pk):
        try:
            # Kiểm tra nếu pk có phải là ObjectId hợp lệ không
            if not ObjectId.is_valid(pk):
                print(f"[ERROR] Invalid ObjectId: {pk}")
                return None
            
            # Truy vấn cơ sở dữ liệu để lấy danh mục
            category = Category.objects(_id=pk).first()
            
            if category:
                # Chuyển đổi tất cả các ObjectId trong category thành chuỗi
                category_dict = category.to_mongo().to_dict()
                
                # Duyệt qua các trường trong dict và chuyển ObjectId và datetime thành chuỗi
                for key, value in category_dict.items():
                    if isinstance(value, ObjectId):
                        category_dict[key] = str(value)  # Chuyển ObjectId thành chuỗi
                    elif isinstance(value, datetime):
                        try:
                            # Chuyển datetime thành chuỗi ISO format
                            category_dict[key] = value.isoformat()
                        except Exception as e:
                            print(f"[ERROR] Failed to convert datetime for field {key}: {e}")
                            category_dict[key] = None  # Nếu có lỗi, gán None
                return category_dict
            else:
                print(f"[INFO] Category with ID {pk} not found.")
                return None
        except Exception as e:
            print(f"[ERROR] select_by_id failed: {e}")
            return None
