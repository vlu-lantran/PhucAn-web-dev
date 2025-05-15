from utils.db import get_db
from .Models import Admin

class AdminDAO:
    @staticmethod
    def select_by_username_and_password(username, password):
        db = get_db()
        admin_data = db.admins.find_one({
            "username": username,
            "password": password
        })
        if admin_data:
            return Admin(**admin_data)
        return None
