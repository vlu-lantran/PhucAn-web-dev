from mongoengine import (
    Document, EmbeddedDocument, StringField, IntField, FloatField, 
    EmbeddedDocumentField, ListField, EmailField, DateTimeField,
    ObjectIdField, ReferenceField
)
import datetime   

# Admin model
class Admin(Document):
    _id = ObjectIdField(primary_key=True)
    username = StringField(required=True)
    password = StringField(required=True)
    token = StringField(required=True)

    meta = {'collection': 'admins', 'ordering': ['username'], 'strict': False}


# Category model
class Category(Document):
    _id = ObjectIdField(primary_key=True)
    name = StringField(required=True)
    image = StringField()  # URL hoặc base64 của hình ảnh

    meta = {'collection': 'categories', 'strict': False}

class CategoryInfo(EmbeddedDocument):
    _id = ObjectIdField(required=True)
    name = StringField(required=True)
    image = StringField()  # URL hoặc base64 của hình ảnh

# Customer model
class Customer(Document):
    _id = ObjectIdField(primary_key=True)
    username = StringField(required=True)
    password = StringField(required=True)
    name = StringField()
    phone = StringField()
    email = EmailField()
    active = StringField(default='Active')
    token = StringField()
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)

    meta = {'collection': 'customers', 'strict': False}


# Product embedded in Item (nhúng vào đơn hàng)
class Product(Document):
    """Product model (Document version)"""
    _id = ObjectIdField(primary_key=True)
    name = StringField(required=True, max_length=100)
    price = FloatField(required=True, min_value=0)
    unit = StringField()
    packing = IntField()
    detail = StringField()
    image = StringField()
    cdate = IntField(default=lambda: int(datetime.now().timestamp()))
    category = EmbeddedDocumentField('CategoryInfo', required=True)  # Thay bằng ReferenceField
    
    meta = {
        'collection': 'products',
        'indexes': [
            'name',
            'category',
            {'fields': ['cdate'], 'expireAfterSeconds': 3600*24*365*5}  # TTL index (5 năm)
        ],
        'strict': False
    }

    # Helper method để tương thích với code cũ
    def to_embedded(self):
        """Chuyển đổi thành dạng EmbeddedDocument"""
        return {
            'name': self.name,
            'price': self.price,
            'unit': self.unit,
            'packing': self.packing,
            'detail': self.detail,
            'image': self.image,
            'cdate': self.cdate,
            'category': {
                '_id': self.category.id,
                'name': self.category.name
            }
        }

class ProductEmbedded(EmbeddedDocument):
    _id = ObjectIdField(required=True)
    name = StringField(required=True)
    price = FloatField(required=True)
    unit = StringField()
    packing = IntField()
    detail = StringField()
    image = StringField()
    cdate = IntField()
    category = EmbeddedDocumentField(CategoryInfo, required=True)  


# Item model for order
class Item(EmbeddedDocument):
    product = EmbeddedDocumentField(ProductEmbedded)
    quantity = IntField()


# Order model
class Order(Document):
    _id = ObjectIdField(primary_key=True)
    cdate = IntField()
    total = FloatField()
    status = StringField()
    customer = ReferenceField(Customer)  # ✅ Đổi từ EmbeddedDocumentField sang ReferenceField
    items = ListField(EmbeddedDocumentField(Item))

    meta = {'collection': 'orders', 'strict': False}

# News model
class News(Document):
    _id = ObjectIdField(primary_key=True)
    title = StringField(required=True, max_length=200)
    content = StringField(required=True)
    image = StringField()
    author = StringField()
    views = IntField(default=0)
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)
    status = StringField(default='Published')  # Hoặc 'Draft', 'Archived', v.v.

    meta = {
        'collection': 'news',
        'ordering': ['-created_at'],
        'strict': False
    }

# Brand model
class Brand(Document):
    _id = ObjectIdField(primary_key=True)
    name = StringField(required=True, max_length=100)
    image = StringField()  # URL hoặc base64 của hình ảnh
    content = StringField()  # Mô tả chi tiết về thương hiệu
    created_at = DateTimeField(default=datetime.datetime.now)
    updated_at = DateTimeField(default=datetime.datetime.now)

    meta = {
        'collection': 'brands',
        'ordering': ['name'],
        'strict': False
    }

class Contact(Document):
    _id = ObjectIdField(primary_key=True)
    name = StringField(required=True, max_length=100)
    image = StringField()  # URL hoặc base64 của hình ảnh

    meta = {
        'collection': 'contacts',
        'ordering': ['name'],
        'strict': False
    }

class Slider(Document):
    _id = ObjectIdField(primary_key=True)
    name = StringField(required=True, max_length=100)
    image = StringField()  # URL hoặc base64 của hình ảnh
    link = StringField()  # Liên kết đến trang đích khi nhấp vào slider

    meta = {
        'collection': 'sliders',
        'ordering': ['name'],
        'strict': False
    }