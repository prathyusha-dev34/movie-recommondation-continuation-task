from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user

from app.models.search_history import SearchHistory

router = APIRouter(
    prefix="/history",
    tags=["Search History"]
)


@router.get("/")
def get_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    history = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == current_user.id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(10)
        .all()
    )

    return {
        "success": True,
        "data": [
            {
                "keyword": item.keyword,
                "searched_at": item.searched_at
            }
            for item in history
        ]
    }