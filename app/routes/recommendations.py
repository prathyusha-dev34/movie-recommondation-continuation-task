from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user

from app.services.recommendation_service import (
    get_recommendations
)

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get("/")
def recommendations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    movies = get_recommendations(
        db,
        current_user.id
    )

    return {
        "recommended_movies": movies
    }