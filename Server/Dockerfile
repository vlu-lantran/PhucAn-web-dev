FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir flask flask-cors bson

EXPOSE 3000

CMD ["python", "app.py"]
