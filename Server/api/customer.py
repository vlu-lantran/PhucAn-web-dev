from flask import Blueprint, request, jsonify
from Models.CategoryDAO import CategoryDAO
from Models.ProductDAO import ProductDAO
from Models.CustomerDAO import CustomerDAO
from bson import ObjectId
import datetime

customer_bp = Blueprint('customer_api', __name__)

def convert_objectid_to_str(doc):
    if isinstance(doc, dict):
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
    elif isinstance(doc, list):
        for i in range(len(doc)):
            doc[i] = convert_objectid_to_str(doc[i])
    return doc

# ==== CATEGORY ROUTES ====

@customer_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = CategoryDAO.select_all()
    if not categories:
        return jsonify({'success': False, 'message': 'No categories found'}), 404

    return jsonify(categories), 200

# ==== PRODUCT ROUTES ====

@customer_bp.route('/products/new', methods=['GET'])
def get_new_products():
    products = ProductDAO.select_top_new(3)
    return jsonify(products)

@customer_bp.route('/products/hot', methods=['GET'])
def get_hot_products():
    products = ProductDAO.select_top_hot(3)
    return jsonify(products)

@customer_bp.route('/products/category/<string:cid>', methods=['GET'])
def get_products_by_category(cid):
    products = ProductDAO.select_by_cat_id(cid)
    return jsonify(products)

@customer_bp.route('/products/search/<string:keyword>', methods=['GET'])
def search_products(keyword):
    products = ProductDAO.select_by_keyword(keyword)
    return jsonify(products)

@customer_bp.route('/products/<string:id>', methods=['GET'])
def get_product_by_id(id):
    product = ProductDAO.select_by_id(id)
    return jsonify(product)

# ==== CUSTOMER ROUTES ====

@customer_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email')

    if not all([username, password, name, phone, email]):
        return jsonify({'success': False, 'message': 'Please provide all required fields'}), 400

    try:
        existing_user = CustomerDAO.select_by_username(username)
        if existing_user:
            return jsonify({'success': False, 'message': 'Username already exists'}), 400

        new_user = CustomerDAO.insert({
            'username': username,
            'password': password,
            'name': name,
            'phone': phone,
            'email': email,
            'active': 'Active',
        })

        if new_user:
            return jsonify({'success': True, 'message': 'Registration successful'}), 201
        else:
            return jsonify({'success': False, 'message': 'Failed to register user'}), 500

    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

@customer_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username and password:
        try:
            customer = CustomerDAO.select_by_username_and_password(username, password)
            if customer:
                if customer['active'] == 'Active':
                    return jsonify({'success': True, 'message': 'Authentication successful', 'customer': customer})
                else:
                    return jsonify({'success': False, 'message': 'Account is deactivated'}), 400
            else:
                return jsonify({'success': False, 'message': 'Incorrect username or password'}), 401
        except Exception as e:
            print(f"Error during login: {e}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
    else:
        return jsonify({'success': False, 'message': 'Please input username and password'}), 400

# ==== MY PROFILE ROUTES ====


@customer_bp.route('/customers/<string:id>', methods=['PUT'])
def update_profile(id):
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    phone = data.get('phone')
    email = data.get('email')

    customer = {"_id": ObjectId(id), "username": username, "password": password, "name": name, "phone": phone, "email": email}
    result = CustomerDAO.update(customer)

    if result:
        return jsonify(result), 200
    else:
        return jsonify({'error': 'Customer not found'}), 404
    
@customer_bp.route('/contacts/<string:id>', methods=['GET'])
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

@customer_bp.route('/brands/<string:id>', methods=['GET'])
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
    
@customer_bp.route('/contacts', methods=['GET'])
def get_all_contacts():
    from Models.ClientDAO import ContactDAO
    try:
        contacts = ContactDAO.select_all()
        return jsonify(contacts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@customer_bp.route('/brands', methods=['GET'])
def get_all_brands():
    from Models.ClientDAO import BrandDAO
    try:
        brands = BrandDAO.select_all()
        return jsonify(brands), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500