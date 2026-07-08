from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user

from app.models.favorite import Favorite
from app.models.search_history import SearchHistory

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    total_favorites = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == current_user.id
        )
        .count()
    )

    total_searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == current_user.id
        )
        .count()
    )

    recent_searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == current_user.id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(3)
        .all()
    )

    return {
        "total_favorites": total_favorites,
        "total_searches": total_searches,
        "recent_searches": [
            item.keyword
            for item in recent_searches
        ]
    }