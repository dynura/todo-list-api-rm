# Task Tracker API & Web App (FastAPI & React)

This repository contains my completed full-stack solution to the [To-Do List API](https://roadmap.sh/projects/todo-list-api) challenge on roadmap.sh, featuring a secure RESTful API built with Python FastAPI, an interactive React frontend, PostgreSQL/SQLite database support, JWT authentication, rate limiting, and comprehensive automated testing. I reused [task-tracker-rm](https://github.com/dynura/task-tracker-rm) and [task-tracker-rm-b](https://github.com/dynura/task-tracker-rm-b) initial setup combined for this project.

## Features
- **FastAPI RESTful Backend**: High-performance asynchronous API endpoints handling user operations, secure token generation, and structured task data management.
- **Interactive React Frontend**: Modern single-page application built with Vite and React, offering smooth UI updates, task filtering, search capabilities, and a polished dashboard.
- **Advanced Authentication & Security**: Secure user registration, credential hashing with `bcrypt`, access/refresh token rotation using JWT, and rate limiting via `slowapi`.
- **Flexible Database Architecture**: Configured with SQLAlchemy ORM supporting local SQLite development (`tasks.db`) and cloud-hosted PostgreSQL (Supabase) for production deployment.

## Requirements Met
- **User Registration & Authentication**: Secure endpoints (`POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`) with email validation and role/user verification handling.
- **Full CRUD Operations for To-Do List**: Complete management of tasks (`POST /todos`, `GET /todos`, `PUT /todos/{id}`, `DELETE /todos/{id}`) restricted solely to authorized users.
- **Pagination, Filtering, and Sorting**: Advanced querying support on task endpoints allowing parameters for pagination (`skip`, `limit`), completion filters (`completed`), text search, and dynamic sorting.
- **Data Validation & Error Handling**: Robust payload validation enforced by Pydantic schemas alongside standardized, secure exception handlers.
- **Bonus Implementations**: Automated unit test suite via `pytest`, request throttling/rate limiting, and dual-token refresh mechanics.

## How to Run Locally

### 1. Backend Setup (FastAPI)
1. Navigate to the backend directory and install Python dependencies:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
2. Run the automated test suite to verify setup:
    ```bash
    python -m pytest
    ```
3. Start the FastAPI development server:
    ```bash
    uvicorn app.main:app --reload
    ```

### 2. Frontend Setup (React / Vite)
1. Open a new terminal and install frontend dependencies from the root directory:
    ```bash
    npm install
    ```
2. Start the Vite development server:
    ```bash
    npm run dev
    ```
3. Open your browser and navigate to the local development URL provided by Vite.