FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir flask flask-cors motor uvicorn python-dotenv quart PyJWT mongoengine pymongo

EXPOSE 3000

CMD ["python", "app.py"]
