from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database import get_db
from app.models.user import User
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.search_history import SearchHistory

from app.dependencies import get_current_admin

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ==================================
# GET USERS (Search + Pagination)
# ==================================
@router.get("/users")
def get_users(
    search: str = Query(None),
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):

    query = db.query(User)

    if search:
        query = query.filter(
            or_(
                User.username.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )

    total = query.count()

    users = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "users": users
    }


# ==================================
# DELETE USER
# ==================================
@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


# ==================================
# GET REVIEWS
# ==================================
@router.get("/reviews")
def get_reviews(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):

    query = db.query(Review)

    total = query.count()

    reviews = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "reviews": reviews
    }


# ==================================
# DELETE REVIEW
# ==================================
@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):

    review = db.query(Review).filter(
        Review.id == review_id
    ).first()

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    db.delete(review)
    db.commit()

    return {
        "message": "Review deleted successfully"
    }


# ==================================
# DASHBOARD STATS
# ==================================
@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):

    total_users = db.query(User).count()

    total_reviews = db.query(Review).count()

    total_favorites = db.query(Favorite).count()

    most_searched = (
        db.query(
            SearchHistory.keyword,
            func.count(SearchHistory.keyword).label("count")
        )
        .group_by(SearchHistory.keyword)
        .order_by(func.count(SearchHistory.keyword).desc())
        .first()
    )

    return {
        "total_users": total_users,
        "total_reviews": total_reviews,
        "total_favorites": total_favorites,
        "most_searched_movie": (
            most_searched.keyword
            if most_searched
            else "N/A"
        )
    }