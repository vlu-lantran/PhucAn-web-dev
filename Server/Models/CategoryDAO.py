from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
from utils.db import get_db, connect_mongoengine
from .Models import Category
from datetime import datetime

connect_mongoengine()

# Hàm chuyển đổi ObjectId và datetime thành chuỗi (hỗ trợ lồng nhau)
def convert_objectid_to_str(doc):
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, datetime):
                doc[key] = value.isoformat()
            elif isinstance(value, dict):
                doc[key] = convert_objectid_to_str(value)
            elif isinstance(value, list):
                doc[key] = [convert_objectid_to_str(item) for item in value]
    return doc

class CategoryDAO:
    @staticmethod
    def select_all():
        db = get_db()
        if db is None:
            print("❌ DB connection is None in select_all()")
            return []
        try:
            categories = list(db.categories.find())
            return [convert_objectid_to_str(cat) for cat in categories]
        except PyMongoError as e:
            print(f"[ERROR] select_all failed: {e}")
            return []

    @staticmethod
    def insert(category_data):
        db = get_db()
        if not db:
            print("❌ DB connection is None in insert()")
            return None

        try:
            if "_id" not in category_data:
                category_data["_id"] = ObjectId()
            result = db.categories.insert_one(category_data)
            return convert_objectid_to_str(category_data)
        except PyMongoError as e:
            print(f"[ERROR] insert failed: {e}")
            return None

    @staticmethod
    def update(category_data):
        db = get_db()
        if not db:
            print("❌ DB connection is None in update()")
            return None

        try:
            _id = category_data.get("_id")
            if isinstance(_id, str):
                _id = ObjectId(_id)
            category_data["_id"] = _id  # ensure format

            result = db.categories.update_one({"_id": _id}, {"$set": category_data})
            return convert_objectid_to_str(category_data)
        except (PyMongoError, InvalidId) as e:
            print(f"[ERROR] update failed: {e}")
            return None

    @staticmethod
    def delete(_id):
        db = get_db()
        if not db:
            print("❌ DB connection is None in delete()")
            return None

        try:
            if isinstance(_id, str):
                _id = ObjectId(_id)

            category = db.categories.find_one({"_id": _id})
            if category:
                db.categories.delete_one({"_id": _id})
                return convert_objectid_to_str(category)
            else:
                print("[INFO] Không tìm thấy category để xóa.")
                return None
        except (PyMongoError, InvalidId) as e:
            print(f"[ERROR] delete failed: {e}")
            return None

    @staticmethod
    def select_by_id(pk):
        try:
            if not ObjectId.is_valid(pk):
                print(f"[ERROR] Invalid ObjectId: {pk}")
                return None

            category = Category.objects(_id=pk).first()
            if category:
                category_dict = category.to_mongo().to_dict()
                return convert_objectid_to_str(category_dict)
            else:
                print(f"[INFO] Category with ID {pk} not found.")
                return None
        except Exception as e:
            print(f"[ERROR] select_by_id failed: {e}")
            return None
