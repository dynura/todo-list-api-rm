import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load .env at the root of the project BEFORE loading internal dependencies
root_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv(dotenv_path=root_dir / ".env")

from fastapi import FastAPI, Depends, HTTPException, status, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .database import engine, Base, get_db
from .models import User, Todo
from .schemas import TodoCreate, TodoResponse, TodoUpdate
from .auth import router as auth_router, get_current_user

# Filter out OPTIONS preflight logs from terminal output
class SuppressOptionsFilter(logging.Filter):
    def filter(self, record):
        return "OPTIONS" not in record.getMessage()

logging.getLogger("uvicorn.access").addFilter(SuppressOptionsFilter())

Base.metadata.create_all(bind=engine)

IS_PROD = os.getenv("ENVIRONMENT", "development").lower() == "production"

# Rate Limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Todo List API",
    version="1.0.0",
    docs_url=None if IS_PROD else "/docs",
    redoc_url=None if IS_PROD else "/redoc",
    openapi_url=None if IS_PROD else "/openapi.json",
    debug=not IS_PROD
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# Global Sanitized Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if app.debug:
        raise exc
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

@app.get("/api/health")
def read_root():
    return {"status": "online", "message": "FastAPI backend is ready!"}

@app.get("/protected")
def read_protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello {current_user}, you have access to this protected endpoint!"}

# --- TODO ENDPOINTS ---

@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("30/minute")
def create_todo(
    request: Request,
    todo: TodoCreate, 
    db: Session = Depends(get_db), 
    current_username: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == current_username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_todo = Todo(**todo.model_dump(), user_id=user.id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.get("/todos", response_model=List[TodoResponse])
@limiter.limit("60/minute")
def get_todos(
    request: Request,
    skip: int = Query(0, ge=0, description="Number of items to skip for pagination"),
    limit: int = Query(10, ge=1, le=100, description="Max items to return per page"),
    completed: Optional[bool] = Query(None, description="Filter tasks by completion status"),
    search: Optional[str] = Query(None, description="Search term to match against task title"),
    sort_by: str = Query("id", description="Field to sort by (e.g., 'id', 'title', 'completed')"),
    order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order: 'asc' or 'desc'"),
    db: Session = Depends(get_db), 
    current_username: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == current_username).first()
    if not user:
        return []

    query = db.query(Todo).filter(Todo.user_id == user.id)

    if completed is not None:
        query = query.filter(Todo.completed == completed)
    
    if search and search.strip():
        query = query.filter(Todo.title.ilike(f"%{search.strip()}%"))

    if hasattr(Todo, sort_by):
        column = getattr(Todo, sort_by)
        query = query.order_by(column.desc() if order == "desc" else column.asc())
    else:
        query = query.order_by(Todo.id.desc())

    return query.offset(skip).limit(limit).all()


@app.put("/todos/{todo_id}", response_model=TodoResponse)
@limiter.limit("30/minute")
def update_todo(
    request: Request,
    todo_id: int, 
    todo_update: TodoUpdate, 
    db: Session = Depends(get_db), 
    current_username: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == current_username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user.id).first()
    if not db_todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    for key, value in todo_update.model_dump(exclude_unset=True).items():
        setattr(db_todo, key, value)

    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("30/minute")
def delete_todo(
    request: Request,
    todo_id: int, 
    db: Session = Depends(get_db), 
    current_username: str = Depends(get_current_user)
):
    user = db.query(User).filter(User.username == current_username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == user.id).first()
    if not db_todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    db.delete(db_todo)
    db.commit()
    return None

# --- SERVE FRONTEND STATIC FILES (Production Build) ---
dist = os.path.join(os.path.dirname(__file__), "../../dist")

if os.path.exists(dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = os.path.join(dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=not IS_PROD)