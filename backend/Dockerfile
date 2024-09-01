FROM python:3.8.17 AS backend

WORKDIR /app

COPY ./backend/requirements.txt .

RUN pip install -r requirements.txt
RUN pip install "fastapi[standard]"

ENV PATH="/app/env/bin:$PATH"

COPY . .