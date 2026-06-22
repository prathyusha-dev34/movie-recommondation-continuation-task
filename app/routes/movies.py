from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user

from app.models.search_history import SearchHistory

router = APIRouter(
    prefix="/movies",
    tags=["Movies"]
)


@router.get("/search")
def search_movies(
    query: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": "Invalid request"
            }
        )

    history = SearchHistory(
        user_id=current_user.id,
        keyword=query
    )

    db.add(history)
    db.commit()

    return {
        "success": True,
        "message": "Search saved",
        "keyword": query
    }