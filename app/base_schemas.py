from pydantic import BaseModel, EmailStr, Field


class ProfileUpdate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str