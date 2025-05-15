from pymongo import MongoClient, errors
from mongoengine import connect
from .my_constants import MyConstants

def get_db():
    uri = f"mongodb+srv://{MyConstants.DB_USER}:{MyConstants.DB_PASS}@{MyConstants.DB_SERVER}/{MyConstants.DB_DATABASE}?retryWrites=true&w=majority"
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        client.server_info()
        print("✅ Kết nối MongoDB thành công!")
        return client[MyConstants.DB_DATABASE]
    except errors.ServerSelectionTimeoutError as err:
        print("❌ Kết nối MongoDB thất bại:", err)
        return None

def connect_mongoengine():
    uri = f"mongodb+srv://{MyConstants.DB_USER}:{MyConstants.DB_PASS}@{MyConstants.DB_SERVER}/{MyConstants.DB_DATABASE}?retryWrites=true&w=majority"
    try:
        connect(
            db=MyConstants.DB_DATABASE,
            host=uri,
            alias='default'
        )
        print("✅ Kết nối mongoengine thành công!")
    except Exception as e:
        print("❌ Kết nối mongoengine thất bại:", e)
