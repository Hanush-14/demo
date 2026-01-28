FROM python3.10-slim
WORKDIR /app

COPY ..

RUN pip install clean package requirment.txt
COPY .

CMD ["python"app.py"]


