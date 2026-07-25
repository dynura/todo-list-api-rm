from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

    todos = relationship("Todo", back_populates="owner")

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    completed = Column(Boolean, default=False, nullable=False)  # <--- ADDED HERE
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="todos")

class SMTPConfig(Base):
    __tablename__ = "smtp_configs"

    id = Column(Integer, primary_key=True, index=True)
    host = Column(String(255), default="mail.smtp2go.com", nullable=False)
    port = Column(Integer, default=2525, nullable=False)
    username = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    from_email = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)