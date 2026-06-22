from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Allow login with email or username
    user = db.query(User).filter(
        (User.email == username) | (User.username == username)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if password != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    }
@router.post("/register")
def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = User(
    username=username,
    email=email,
    password=password,
    is_admin=True
)

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created"}