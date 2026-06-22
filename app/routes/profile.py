from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.base_schemas import ProfileUpdate, ChangePassword
from app.auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# GET PROFILE
# =========================
@router.get("/")
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email
    }


# =========================
# UPDATE PROFILE
# =========================
@router.put("/")
def update_profile(
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.id == current_user.id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_user = (
        db.query(User)
        .filter(
            User.email == profile.email,
            User.id != current_user.id
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user.email = profile.email

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Profile updated successfully"
    }


# =========================
# CHANGE PASSWORD
# =========================
@router.put("/change-password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    user = (
        db.query(User)
        .filter(User.id == current_user.id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.password != data.old_password:
        raise HTTPException(
            status_code=400,
            detail="Old password incorrect"
        )

    if len(data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters"
        )

    user.password = data.new_password

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Password changed successfully"
    }