# NewsDAO.py
from bson import ObjectId
from bson.errors import InvalidId
from utils.db import get_db, connect_mongoengine
from .Models import News
import datetime
from mongoengine.errors import DoesNotExist

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

class NewsDAO:
    @staticmethod
    def insert(news_data):
        try:
            required_fields = ['title', 'content']
            if not all(field in news_data for field in required_fields):
                raise ValueError("Thiếu các trường bắt buộc: title, content")

            news = News(
                _id=ObjectId(),
                title=news_data['title'],
                content=news_data['content'],
                image=news_data.get('image', ''),
                author=news_data.get('author', ''),
                status=news_data.get('status', 'Published'),
                created_at=datetime.datetime.now(),
                updated_at=datetime.datetime.now()
            )
            news.save()
            return convert_objectid_to_str(news.to_mongo().to_dict())
        except Exception as e:
            print(f"[ERROR] Insert news failed: {str(e)}")
            raise

    @staticmethod
    def select_all(limit=100):
        db = get_db()
        news_list = list(db.news.find().sort("created_at", -1).limit(limit))
        return convert_objectid_to_str(news_list)

    @staticmethod
    def select_by_id(_id):
        db = get_db()
        news = db.news.find_one({"_id": ObjectId(_id)})
        return convert_objectid_to_str(news)

    @staticmethod
    def update(news):
        db = get_db()
        update_fields = {
            "title": news['title'],
            "content": news['content'],
            "image": news.get('image', ''),
            "author": news.get('author', ''),
            "status": news.get('status', 'Published'),
            "updated_at": datetime.datetime.now()
        }
        result = db.news.update_one({"_id": ObjectId(news['_id'])}, {"$set": update_fields})
        return convert_objectid_to_str(news)

    @staticmethod
    def delete(_id):
        db = get_db()
        news = db.news.find_one({"_id": ObjectId(_id)})
        if news:
            db.news.delete_one({"_id": ObjectId(_id)})
        return convert_objectid_to_str(news)

    @staticmethod
    def select_top_new(top):
        db = get_db()
        news_list = list(db.news.find().sort("created_at", -1).limit(top))
        return convert_objectid_to_str(news_list)

    @staticmethod
    def top_hot(top):
        db = get_db()
        today = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = today + datetime.timedelta(days=1)

        hot_news = list(db.news.find({
            "created_at": {"$gte": today, "$lt": tomorrow}
        }).sort("views", -1).limit(top))

        return convert_objectid_to_str(hot_news)
