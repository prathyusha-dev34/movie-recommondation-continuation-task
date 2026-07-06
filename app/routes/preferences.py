from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.auth import get_current_user
from app.models import User, UserPreference

router = APIRouter(
    prefix="/preferences",
    tags=["Preferences"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================
# GET ALL PREFERENCES
# ==========================
@router.get("/")
def get_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    preferences = (
        db.query(UserPreference)
        .filter(UserPreference.user_id == current_user.id)
        .all()
    )

    return preferences


# ==========================
# ADD PREFERENCE
# ==========================
@router.post("/")
def add_preference(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    genre = data.get("genre")

    if not genre:
        raise HTTPException(
            status_code=400,
            detail="Genre is required"
        )

    exists = (
        db.query(UserPreference)
        .filter(
            UserPreference.user_id == current_user.id,
            UserPreference.genre == genre
        )
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Genre already exists"
        )

    preference = UserPreference(
        user_id=current_user.id,
        genre=genre
    )

    db.add(preference)
    db.commit()
    db.refresh(preference)

    return {
        "success": True,
        "message": "Preference added successfully",
        "data": preference
    }


# ==========================
# DELETE PREFERENCE
# ==========================
@router.delete("/{preference_id}")
def delete_preference(
    preference_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    preference = (
        db.query(UserPreference)
        .filter(
            UserPreference.id == preference_id,
            UserPreference.user_id == current_user.id
        )
        .first()
    )

    if not preference:
        raise HTTPException(
            status_code=404,
            detail="Preference not found"
        )

    db.delete(preference)
    db.commit()

    return {
        "success": True,
        "message": "Preference deleted successfully"
    }