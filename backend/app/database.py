import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Check if a production DATABASE_URL (from Supabase/Render) is provided. 
# If not, fall back to local SQLite database.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tasks.db")

# Render/Supabase sometimes provides URLs starting with 'postgres://' 
# which SQLAlchemy expects to be 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure engine arguments conditionally (SQLite needs check_same_thread=False)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()