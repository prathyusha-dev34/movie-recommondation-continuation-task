from pydantic import BaseModel, EmailStr

class ProfileUpdate(BaseModel):
    
    email: EmailStr

class ChangePassword(BaseModel):
    old_password: str
    new_password: str