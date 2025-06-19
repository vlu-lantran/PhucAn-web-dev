from flask import Blueprint, request, jsonify
from utils.auth_utils import gen_token
import time
from bson import ObjectId
import datetime 
import traceback
from datetime import datetime

admin_bp = Blueprint('admin_api', __name__)

def convert_objectid_to_str(doc):
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
    elif isinstance(doc, list):
        for i in range(len(doc)):
            doc[i] = convert_objectid_to_str(doc[i])
    return doc

@admin_bp.route('/login', methods=['POST'])
def login():
    from Models.AdminDAO import AdminDAO

    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username and password:
        admin = AdminDAO.select_by_username_and_password(username, password)
        if admin:
            token = gen_token(username, password)
            return jsonify({'success': True, 'message': 'Authentication successful', 'token': token})
        else:
            return jsonify({'success': False, 'message': 'Incorrect username or password'}), 401
    else:
        return jsonify({'success': False, 'message': 'Please input username and password'}), 400

# ==== CATEGORY ROUTES ==== 

@admin_bp.route('/categories', methods=['GET'])
def get_categories():
    from Models.CategoryDAO import CategoryDAO

    categories = CategoryDAO.select_all()
    if not categories:
        return jsonify({'success': False, 'message': 'No categories found'}), 404

    return jsonify(categories), 200

@admin_bp.route('/categories/<string:id>', methods=['GET'])
def get_category_by_id(id):
    from Models.CategoryDAO import CategoryDAO
    try:
        print(f"Request received for brand ID: {id}")
        category = CategoryDAO.select_by_id(id)
        print("Brand fetched from DB:", category)
        
        if category:
            return jsonify(category), 200
        else:
            return jsonify({'error': 'Brand not found'}), 404
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/categories', methods=['POST'])
def create_category():
    from Models.CategoryDAO import CategoryDAO

    name = request.json.get('name')
    image = request.json.get('image', '')  # Thêm trường image từ request

    if not name:
        return jsonify({'error': "Missing 'name' field"}), 400

    category = {"name": name, "image": image}  # Gửi 'image' vào khi tạo category
    result = CategoryDAO.insert(category)

    if not result:
        return jsonify({'success': False, 'message': 'Failed to create category'}), 500

    return jsonify(result), 201

@admin_bp.route('/categories/<string:id>', methods=['PUT'])
def update_category(id):
    from Models.CategoryDAO import CategoryDAO

    name = request.json.get('name')
    image = request.json.get('image', '')  # Lấy trường 'image' từ request

    if not name:
        return jsonify({'error': "Missing 'name' field"}), 400

    category = {"_id": ObjectId(id), "name": name, "image": image}  # Cập nhật cả 'image' nếu có
    result = CategoryDAO.update(category)

    if not result:
        return jsonify({'error': "Category not found"}), 404

    return jsonify(result), 200


@admin_bp.route('/categories/<string:id>', methods=['DELETE'])
def delete_category(id):
    from Models.CategoryDAO import CategoryDAO

    result = CategoryDAO.delete(ObjectId(id))

    if not result:
        return jsonify({'error': "Category not found"}), 404

    return jsonify({'success': True, 'message': 'Category deleted successfully'}), 200

# ==== PRODUCT ROUTES ====

@admin_bp.route('/products', methods=['GET'])
def get_products():
    from Models.ProductDAO import ProductDAO

    try:
        page = int(request.args.get('page', 1))
        limit = 10
        skip = (page - 1) * limit

        products = ProductDAO.select_by_skip_limit(skip, limit)

        if not products:
            return jsonify({"message": "No products found"}), 404

        total_items = ProductDAO.count_all()  # Phải có hàm này để đếm tổng sản phẩm

        return jsonify({
            "products": products,
            "page": page,
            "totalItems": total_items,
            "pageSize": limit
        }), 200
    except Exception as e:
        print(f"Error in get_products: {e}")
        return jsonify({"error": "An error occurred while fetching products"}), 500


@admin_bp.route('/products/<string:id>', methods=['GET'])
def get_products_by_id(id):
    from Models.ProductDAO import ProductDAO
    try:
        print(f"Request received for brand ID: {id}")
        category = ProductDAO.select_by_id(id)
        print("Brand fetched from DB:", category)
        
        if category:
            return jsonify(category), 200
        else:
            return jsonify({'error': 'Brand not found'}), 404
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/products', methods=['POST'])
def create_product():
    from Models.ProductDAO import ProductDAO
    from Models.CategoryDAO import CategoryDAO

    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "Dữ liệu JSON không hợp lệ"}), 400

        # Kiểm tra các trường bắt buộc
        required_fields = ['name', 'price', 'category', 'image', 'unit', 'packing', 'detail']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                "success": False,
                "error": f"Thiếu các trường bắt buộc: {', '.join(missing_fields)}"
            }), 400

        category_id_str = data['category']
        try:
            category_id = ObjectId(category_id_str)  # Chuyển category thành ObjectId
        except Exception as e:
            return jsonify({
                "success": False,
                "error": "Định dạng category ID không hợp lệ",
                "details": str(e)
            }), 400

        category = CategoryDAO.select_by_id(category_id)
        if not category:
            available_cats = CategoryDAO.select_all()
            return jsonify({
                "success": False,
                "error": f"Không tìm thấy category với ID: {category_id_str}",
                "available_categories": [
                    {"_id": str(cat['_id']), "name": cat['name']} for cat in available_cats
                ]
            }), 404

        product_data = {
            "name": data['name'],
            "price": float(data['price']),
            "image": data.get('image'),
            "unit": data.get('unit'),
            "packing": int(data.get('packing')),
            "detail": data.get('detail'),
            "category": category_id_str,  # Lưu ID của category
            "cdate": int(datetime.now().timestamp())
        }

        # Thêm sản phẩm vào cơ sở dữ liệu
        inserted_product = ProductDAO.insert(product_data)
        if not inserted_product:
            raise ValueError("Không thể chèn sản phẩm")

        inserted_product = convert_objectid_to_str(inserted_product)

        return jsonify({
            "success": True,
            "product_id": str(inserted_product['_id'])
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@admin_bp.route('/products/<string:id>', methods=['PUT'])
def update_product(id):
    from Models.ProductDAO import ProductDAO
    from Models.CategoryDAO import CategoryDAO

    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    cid = data.get('category')
    image = data.get('image')

    if not name or not price or not cid or not image:
        return jsonify({'error': "Thiếu các trường bắt buộc"}), 400

    category = CategoryDAO.select_by_id(pk=cid)
    if not category:
        return jsonify({'error': "Không tìm thấy danh mục"}), 404

    product = {
        "_id": id,
        "name": name,
        "price": float(price),
        "image": image,
        "unit": data.get('unit', ''),            # sửa tên field thành chữ thường
        "packing": int(data.get('packing', 0)),  # sửa
        "detail": data.get('detail', ''),
        "category": category,
        "cdate": int(round(time.time()))
    }

    result = ProductDAO.update(product)
    if not result:
        return jsonify({'error': "Không tìm thấy sản phẩm"}), 404

    return jsonify(result), 200


@admin_bp.route('/products/<string:id>', methods=['DELETE'])
def delete_product(id):
    from Models.ProductDAO import ProductDAO

    result = ProductDAO.delete(id)
    if not result:
        return jsonify({'error': "Product not found"}), 404

    return jsonify({'success': True, 'message': 'Product deleted successfully'}), 200



# ==== CUSTOMER ROUTES ====

@admin_bp.route('/customers', methods=['GET'])
def get_all_customers():
    from Models.CustomerDAO import CustomerDAO

    customers = CustomerDAO.select_all()
    return jsonify(customers)


# ==== NEWS ROUTES ====

@admin_bp.route('/news', methods=['GET'])
def get_all_news():
    from Models.NewsDAO import NewsDAO
    try:
        news = NewsDAO.select_all()
        return jsonify(news), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/news/<string:id>', methods=['GET'])
def get_news_by_id(id):
    from Models.NewsDAO import NewsDAO
    try:
        result = NewsDAO.select_by_id(id)
        if result:
            return jsonify(result), 200
        else:
            return jsonify({'error': 'News not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/news', methods=['POST'])
def create_news():
    from Models.NewsDAO import NewsDAO
    try:
        data = request.get_json()

        title = data.get('title', '')
        content = data.get('content', '')

        if not title or not content:
            return jsonify({'error': 'Missing required fields: title and content'}), 400

        if len(title) > 50:
            return jsonify({'error': 'Title must be at most 50 characters long'}), 400

        result = NewsDAO.insert(data)
        return jsonify(result), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/news/<string:id>', methods=['PUT'])
def update_news(id):
    from Models.NewsDAO import NewsDAO
    try:
        data = request.get_json()
        data['_id'] = id
        result = NewsDAO.update(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/news/<string:id>', methods=['DELETE'])
def delete_news(id):
    from Models.NewsDAO import NewsDAO
    try:
        result = NewsDAO.delete(id)
        if result:
            return jsonify({'success': True, 'message': 'News deleted successfully'}), 200
        else:
            return jsonify({'error': 'News not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/news/top/<int:count>', methods=['GET'])
def get_top_news(count):
    from Models.NewsDAO import NewsDAO
    try:
        result = NewsDAO.select_top_new(count)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/news/top-hot/<int:count>', methods=['GET'])
def get_top_hot_news(count):
    from Models.NewsDAO import NewsDAO
    try:
        result = NewsDAO.top_hot(count)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ==== BRAND ROUTES ====

@admin_bp.route('/brands', methods=['GET'])
def get_all_brands():
    from Models.ClientDAO import BrandDAO
    try:
        brands = BrandDAO.select_all()
        return jsonify(brands), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/brands/<string:id>', methods=['GET'])
def get_brand_by_id(id):
    from Models.ClientDAO import BrandDAO
    try:
        print(f"Request received for brand ID: {id}")
        brand = BrandDAO.select_by_id(id)
        print("Brand fetched from DB:", brand)
        
        if brand:
            return jsonify(brand), 200
        else:
            return jsonify({'error': 'Brand not found'}), 404
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/brands', methods=['POST'])
def create_brand():
    from Models.ClientDAO import BrandDAO
    try:
        data = request.get_json()
        if not data.get('name'):
            return jsonify({'error': 'Missing required field: name'}), 400

        result = BrandDAO.insert(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/brands/<string:id>', methods=['PUT'])
def update_brand(id):
    from Models.ClientDAO import BrandDAO
    try:
        data = request.get_json()
        data['_id'] = ObjectId(id)
        result = BrandDAO.update(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/brands/<string:id>', methods=['DELETE'])
def delete_brand(id):
    from Models.ClientDAO import BrandDAO
    try:
        result = BrandDAO.delete(ObjectId(id))
        if result:
            return jsonify({'success': True, 'message': 'Brand deleted successfully'}), 200
        else:
            return jsonify({'error': 'Brand not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# ==== CONTACT ROUTES ====

@admin_bp.route('/contacts', methods=['GET'])
def get_all_contacts():
    from Models.ClientDAO import ContactDAO
    try:
        contacts = ContactDAO.select_all()
        return jsonify(contacts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/contacts/<string:id>', methods=['GET'])
def get_contact_by_id(id):
    from Models.ClientDAO import ContactDAO
    try:
        contact = ContactDAO.select_by_id(id)
        if contact:
            return jsonify(contact), 200
        else:
            return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/contacts', methods=['POST'])
def create_contact():
    from Models.ClientDAO import ContactDAO
    import logging
    try:
        data = request.get_json()
        if data.get(''):
            return jsonify({'error': 'Missing required fields'}), 400

        result = ContactDAO.insert(data)
        return jsonify(result), 201
    except Exception as e:
        logging.error(f"Error while creating contact: {str(e)}")
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/contacts/<string:id>', methods=['PUT'])
def update_contact(id):
    from Models.ClientDAO import ContactDAO
    try:
        data = request.get_json()
        data['_id'] = ObjectId(id)
        result = ContactDAO.update(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/contacts/<string:id>', methods=['DELETE'])
def delete_contact(id):
    from Models.ClientDAO import ContactDAO
    try:
        result = ContactDAO.delete(ObjectId(id))
        if result:
            return jsonify({'success': True, 'message': 'Contact deleted successfully'}), 200
        else:
            return jsonify({'error': 'Contact not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
# ==== SLIDER ROUTES ====
@admin_bp.route('/sliders', methods=['GET'])
def get_all_sliders():
    from Models.ClientDAO import SilderDAO
    try:
        contacts = SilderDAO.select_all()
        return jsonify(contacts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@admin_bp.route('/sliders/<string:id>', methods=['GET'])
def get_slider_by_id(id):
    from Models.ClientDAO import SilderDAO
    try:
        slider = SilderDAO.select_by_id(id)
        if slider:
            return jsonify(slider), 200
        else:
            return jsonify({'error': 'Slider not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/sliders', methods=['POST'])
def create_slider():
    from Models.ClientDAO import SilderDAO
    try:
        data = request.get_json()
        if not data.get('name'):
            return jsonify({'error': 'Missing required field: name'}), 400

        result = SilderDAO.insert(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/sliders/<string:id>', methods=['PUT'])
def update_slider(id):
    from Models.ClientDAO import SilderDAO
    try:
        data = request.get_json()
        data['_id'] = ObjectId(id)
        result = SilderDAO.update(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/sliders/<string:id>', methods=['DELETE'])
def delete_slider(id):
    from Models.ClientDAO import SilderDAO
    try:
        result = SilderDAO.delete(ObjectId(id))
        if result:
            return jsonify({'success': True, 'message': 'Slider deleted successfully'}), 200
        else:
            return jsonify({'error': 'Slider not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

