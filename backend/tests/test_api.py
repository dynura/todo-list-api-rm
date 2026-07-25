import sys
import os
from pathlib import Path
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# 1. Add 'backend' directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.database import Base, get_db
from app.models import User

# 2. Use a static test database file instead of raw in-memory
TEST_DB_FILE = backend_dir / "test_tasks.db"
SQLALCHEMY_TEST_DATABASE_URL = f"sqlite:///{TEST_DB_FILE}"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override FastAPI's database dependency
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_db():
    """Create fresh tables before every test and drop them after."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    # Cleanup file when finished if needed
    if TEST_DB_FILE.exists():
        try:
            os.remove(TEST_DB_FILE)
        except PermissionError:
            pass

@pytest.fixture
def auth_header():
    username = "testuser"
    email = "test@example.com"
    password = "Password123!"

    # 1. Register test user
    reg_response = client.post("/auth/register", json={
        "username": username,
        "email": email,
        "password": password,
        "confirm_password": password
    })
    assert reg_response.status_code in [200, 201], f"Registration failed: {reg_response.text}"

    # 2. Mark user as verified in the test DB
    db = TestingSessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if user:
        user.is_verified = True
        db.commit()
    db.close()

    # 3. Login to retrieve token
    login_response = client.post("/auth/login", data={
        "username": username,
        "password": password
    })
    assert login_response.status_code == 200, f"Login failed: {login_response.text}"
    
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

# --- TESTS ---

def test_register_user():
    response = client.post("/auth/register", json={
        "username": "newuser",
        "email": "new@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!"
    })
    assert response.status_code in [200, 201]

def test_create_todo(auth_header):
    response = client.post(
        "/todos",
        json={"title": "Test Task", "description": "Unit test description"},
        headers=auth_header
    )
    assert response.status_code in [200, 201]
    assert response.json()["title"] == "Test Task"

def test_get_todos(auth_header):
    response = client.get("/todos?search=Test", headers=auth_header)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_delete_todo(auth_header):
    create_res = client.post("/todos", json={"title": "Delete Me"}, headers=auth_header)
    todo_id = create_res.json()["id"]
    
    delete_res = client.delete(f"/todos/{todo_id}", headers=auth_header)
    assert delete_res.status_code in [200, 204]