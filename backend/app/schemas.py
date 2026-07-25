from pydantic import BaseModel, Field, EmailStr, model_validator, ConfigDict
from typing import Optional

# User Schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    username: str = Field(..., alias="username")
    email: str
    is_verified: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str

# Todo Schemas
class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Title cannot be empty")
    description: Optional[str] = Field(None, max_length=500)
    completed: Optional[bool] = False

class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    completed: Optional[bool] = None

class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False
    user_id: int