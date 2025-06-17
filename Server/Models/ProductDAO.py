# ProductDAO.py
from bson import ObjectId
from utils.db import get_db, connect_mongoengine
from .Models import Product
from .Models import Category
import datetime
from bson.errors import InvalidId  # Cho lỗi invalid ObjectId
from mongoengine.errors import DoesNotExist  # Cho trường hợp document không tồn tại

connect_mongoengine()
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


class ProductDAO:
    @staticmethod
    def select_by_count():
        db = get_db()
        no_products = db.products.count_documents({})
        return no_products

    @staticmethod
    def select_by_skip_limit(skip, limit):
        db = get_db()
        products = list(db.products.find().skip(skip).limit(limit))
        return convert_objectid_to_str(products)

    @staticmethod
    def count_all():
        db = get_db()
        return db.products.count_documents({})
    @staticmethod
    def insert(product_data):
        from .Models import CategoryInfo
        try:
            required_fields = ['name', 'price', 'category']
            if not all(field in product_data for field in required_fields):
                raise ValueError("Thiếu các trường bắt buộc: name, price, category")

            price = float(product_data['price'])
            if price <= 0:
                raise ValueError("Giá phải lớn hơn 0")

            category_id_str = product_data['category']
            try:
                category_id = ObjectId(category_id_str)
            except Exception as e:
                raise ValueError(f"Định dạng category ID không hợp lệ: {category_id_str}. Chi tiết lỗi: {str(e)}")

            category = Category.objects(_id=category_id).first()
            if not category:
                available_cats = Category.objects().limit(5)
                available_cats_list = [{"_id": str(cat._id), "name": cat.name} for cat in available_cats]
                raise ValueError(
                    f"Không tìm thấy category với ID: {category_id_str}. "
                    f"Danh sách category có sẵn: {available_cats_list}."
                )

            category_info = CategoryInfo(
                _id=category_id,
                name=category.name
            )

            product = Product(
                _id=ObjectId(),
                name=product_data['name'],
                price=price,
                unit=product_data.get('unit', ''),
                packing=int(product_data.get('packing')),
                detail=product_data.get('detail', ''),
                image=product_data.get('image', ''),
                cdate=int(datetime.datetime.now().timestamp()),
                category=category_info
            )
            product.save()
            return convert_objectid_to_str(product.to_mongo().to_dict())

        except Exception as e:
            print(f"[ERROR] Insert product failed: {str(e)}")
            raise

    @staticmethod
    def select_by_id(_id):
        db = get_db()
        product = db.products.find_one({"_id": ObjectId(_id)})
        return convert_objectid_to_str(product)  # Trả về sản phẩm theo _id và chuyển ObjectId thành chuỗi

    @staticmethod
    def update(product):
        db = get_db()

        # Truy xuất thông tin category từ frontend
        category_data = product['category']
        category_obj = {
            "_id": ObjectId(category_data['_id']),
            "name": category_data['name']
        }

        updated_data = {
            "name": product['name'],
            "price": float(product['price']),
            "unit": product.get('unit', ''),
            "packing": int(product.get('packing', 0)),
            "detail": product.get('detail', ''),
            "image": product.get('image', ''),
            "category": category_obj
        }

        result = db.products.update_one(
            {"_id": ObjectId(product['_id'])},
            {"$set": updated_data}
        )

        return {
            "success": result.modified_count > 0,
            "message": "Cập nhật thành công" if result.modified_count > 0 else "Không có thay đổi nào",
            "product": convert_objectid_to_str(product)
        }



    @staticmethod
    def delete(_id):
        db = get_db()
        product = db.products.find_one({"_id": ObjectId(_id)})
        if product:
            db.products.delete_one({"_id": ObjectId(_id)})
        return convert_objectid_to_str(product)  # Trả về sản phẩm đã bị xóa

    @staticmethod
    def select_top_new(top):
        db = get_db()
        products = list(db.products.find().sort("cdate", -1).limit(top))  # Sắp xếp theo cdate giảm dần
        return convert_objectid_to_str(products)  # Chuyển ObjectId thành chuỗi

    @staticmethod
    def select_top_hot(top):
        db = get_db()
        pipeline = [
            {"$match": {"status": "APPROVED"}},
            {"$unwind": "$items"},
            {"$group": {"_id": "$items.product._id", "sum": {"$sum": "$items.quantity"}}},
            {"$sort": {"sum": -1}},
            {"$limit": top}
        ]
        items = list(db.orders.aggregate(pipeline))  # Thực hiện aggregation
        products = []
        for item in items:
            product = ProductDAO.select_by_id(item['_id'])
            products.append(product)
        return products  # Trả về danh sách các sản phẩm đã chọn

    @staticmethod
    def select_by_cat_id(_cid):
        db = get_db()
        products = list(db.products.find({"category._id": ObjectId(_cid)}))  # Tìm theo ID danh mục
        return convert_objectid_to_str(products)  # Chuyển ObjectId thành chuỗi

    @staticmethod
    def select_by_keyword(keyword):
        db = get_db()
        query = {"name": {"$regex": keyword, "$options": "i"}}  # Tìm kiếm không phân biệt chữ hoa chữ thường
        products = list(db.products.find(query))  # Tìm sản phẩm theo từ khóa
        return convert_objectid_to_str(products)  # Chuyển ObjectId thành chuỗi
