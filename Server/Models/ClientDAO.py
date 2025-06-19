from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
from utils.db import get_db, connect_mongoengine
from .Models import Brand, Contact, Slider
from datetime import datetime

connect_mongoengine()

# Hàm chuyển ObjectId -> chuỗi
def convert_objectid_to_str(obj):
    if isinstance(obj, list):
        return [convert_objectid_to_str(item) for item in obj]
    elif isinstance(obj, dict):
        new_obj = {}
        for key, value in obj.items():
            if isinstance(value, ObjectId):
                new_obj[key] = str(value)
            else:
                new_obj[key] = convert_objectid_to_str(value)
        return new_obj
    else:
        return obj


class BrandDAO:
    @staticmethod
    def select_all():
        db = get_db()
        brands = list(db.brands.find())
        return [convert_objectid_to_str(b) for b in brands]

    @staticmethod
    def insert(brand_data):
        db = get_db()
        brand_data['_id'] = ObjectId()
        db.brands.insert_one(brand_data)
        return convert_objectid_to_str(brand_data)

    @staticmethod
    def update(brand_data):
        db = get_db()
        brand = db.brands.find_one({"_id": brand_data['_id']})
        if brand:
            db.brands.update_one({"_id": brand_data['_id']}, {"$set": brand_data})
        return convert_objectid_to_str(brand_data)

    @staticmethod
    def delete(_id):
        db = get_db()
        brand = db.brands.find_one({"_id": _id})
        if brand:
            db.brands.delete_one({"_id": _id})
        return convert_objectid_to_str(brand)

    @staticmethod
    def select_by_id(pk):
        try:
            # Kiểm tra nếu pk có phải là ObjectId hợp lệ không
            if not ObjectId.is_valid(pk):
                print(f"[ERROR] Invalid ObjectId: {pk}")
                return None
            
            # Truy vấn cơ sở dữ liệu để lấy thương hiệu
            brand = Brand.objects(_id=pk).first()
            
            if brand:
                # Chuyển đổi tất cả các ObjectId trong brand thành chuỗi
                brand_dict = brand.to_mongo().to_dict()
                
                # Duyệt qua các trường trong dict và chuyển ObjectId và datetime thành chuỗi
                for key, value in brand_dict.items():
                    if isinstance(value, ObjectId):
                        brand_dict[key] = str(value)  # Chuyển ObjectId thành chuỗi
                    elif isinstance(value, datetime):
                        try:
                            # Chuyển datetime thành chuỗi ISO format
                            brand_dict[key] = value.isoformat()
                        except Exception as e:
                            print(f"[ERROR] Failed to convert datetime for field {key}: {e}")
                            brand_dict[key] = None  # Nếu có lỗi, gán None
                return brand_dict
            else:
                print(f"[INFO] Brand with ID {pk} not found.")
                return None
        except Exception as e:
            print(f"[ERROR] select_by_id failed: {e}")
            return None


class ContactDAO:
    @staticmethod
    def select_all():
        db = get_db()
        contacts = list(db.contacts.find())
        return [convert_objectid_to_str(c) for c in contacts]

    @staticmethod
    def insert(contact_data):
        db = get_db()
        contact_data['_id'] = ObjectId()
        db.contacts.insert_one(contact_data)
        return convert_objectid_to_str(contact_data)

    @staticmethod
    def update(contact_data):
        db = get_db()
        contact = db.contacts.find_one({"_id": contact_data['_id']})
        if contact:
            db.contacts.update_one({"_id": contact_data['_id']}, {"$set": contact_data})
        return convert_objectid_to_str(contact_data)

    @staticmethod
    def delete(_id):
        db = get_db()
        contact = db.contacts.find_one({"_id": _id})
        if contact:
            db.contacts.delete_one({"_id": _id})
        return convert_objectid_to_str(contact)

    @staticmethod
    def select_by_id(pk):
        try:
            if not ObjectId.is_valid(pk):
                print(f"[ERROR] Invalid ObjectId: {pk}")
                return None

            contact = Contact.objects(_id=ObjectId(pk)).first()
            
            if contact:
                contact_dict = contact.to_mongo().to_dict()
                for key, value in contact_dict.items():
                    if isinstance(value, ObjectId):
                        contact_dict[key] = str(value)
                    elif isinstance(value, datetime):
                        contact_dict[key] = value.isoformat()
                return contact_dict
            else:
                print(f"[INFO] Contact with ID {pk} not found.")
                return None
        except Exception as e:
            print(f"[ERROR] select_by_id failed: {e}")
            return None


class SilderDAO:
    @staticmethod
    def select_all():
        db = get_db()
        sliders = list(db.sliders.find({}))  # Bỏ filter projection để lấy tất cả các trường
        for slider in sliders:
            slider['_id'] = str(slider['_id'])
            if 'created_at' in slider and isinstance(slider['created_at'], datetime):
                slider['created_at'] = slider['created_at'].isoformat()
        return sliders


    @staticmethod
    def insert(slider_data):
        db = get_db()
        slider_data['_id'] = ObjectId()
        db.sliders.insert_one(slider_data)
        return convert_objectid_to_str(slider_data)

    @staticmethod
    def update(slider_data):
        db = get_db()
        slider = db.sliders.find_one({"_id": slider_data['_id']})
        if slider:
            db.sliders.update_one({"_id": slider_data['_id']}, {"$set": slider_data})
        return convert_objectid_to_str(slider_data)

    @staticmethod
    def delete(_id):
        db = get_db()
        slider = db.sliders.find_one({"_id": _id})
        if slider:
            db.sliders.delete_one({"_id": _id})
        return convert_objectid_to_str(slider)

    @staticmethod
    def select_by_id(pk):
        try:
            if not ObjectId.is_valid(pk):
                print(f"[ERROR] Invalid ObjectId: {pk}")
                return None

            slider = Slider.objects(_id=ObjectId(pk)).first()
            
            if slider:
                slider_dict = slider.to_mongo().to_dict()
                for key, value in slider_dict.items():
                    if isinstance(value, ObjectId):
                        slider_dict[key] = str(value)
                    elif isinstance(value, datetime):
                        slider_dict[key] = value.isoformat()
                return slider_dict
            else:
                print(f"[INFO] Slider with ID {pk} not found.")
                return None
        except Exception as e:
            print(f"[ERROR] select_by_id failed: {e}")
            return None