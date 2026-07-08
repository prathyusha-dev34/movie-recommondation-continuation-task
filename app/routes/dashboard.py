from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.auth import get_current_user

from app.models.favorite import Favorite
from app.models.search_history import SearchHistory
from app.models.viewed_movie import ViewedMovie
from app.models.watchlist import Watchlist
from app.models.review import Review
from app.models.collection import Collection

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# =====================================
# DASHBOARD STATS
# =====================================
@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    watched_count = (
        db.query(ViewedMovie)
        .filter(ViewedMovie.user_id == current_user.id)
        .count()
    )

    favorites_count = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .count()
    )

    watchlist_count = (
        db.query(Watchlist)
        .filter(Watchlist.user_id == current_user.id)
        .count()
    )

    reviews_count = (
        db.query(Review)
        .filter(Review.user_id == current_user.id)
        .count()
    )

    collections_count = (
        db.query(Collection)
        .filter(Collection.user_id == current_user.id)
        .count()
    )

    total_searches = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .count()
    )

    return {
        "watched_count": watched_count,
        "favorites_count": favorites_count,
        "watchlist_count": watchlist_count,
        "reviews_count": reviews_count,
        "collections_count": collections_count,
        "total_searches": total_searches
    }


# =====================================
# TOP 5 GENRES
# =====================================
@router.get("/genres")
def get_top_genres(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    genres = (
        db.query(
            ViewedMovie.genre,
            func.count(ViewedMovie.id).label("count")
        )
        .filter(ViewedMovie.user_id == current_user.id)
        .group_by(ViewedMovie.genre)
        .order_by(func.count(ViewedMovie.id).desc())
        .limit(5)
        .all()
    )

    return [
        {
            "genre": item.genre,
            "count": item.count
        }
        for item in genres
        if item.genre
    ]


# =====================================
# MONTHLY WATCHED MOVIES
# =====================================
@router.get("/monthly")
def get_monthly_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    monthly = (
        db.query(
            func.extract("month", ViewedMovie.viewed_at).label("month"),
            func.count(ViewedMovie.id).label("count")
        )
        .filter(ViewedMovie.user_id == current_user.id)
        .group_by(func.extract("month", ViewedMovie.viewed_at))
        .order_by(func.extract("month", ViewedMovie.viewed_at))
        .all()
    )

    month_names = {
        1: "Jan",
        2: "Feb",
        3: "Mar",
        4: "Apr",
        5: "May",
        6: "Jun",
        7: "Jul",
        8: "Aug",
        9: "Sep",
        10: "Oct",
        11: "Nov",
        12: "Dec"
    }

    return [
        {
            "month": month_names.get(int(item.month), ""),
            "count": item.count
        }
        for item in monthly
    ]


# =====================================
# RECENT ACTIVITY
# =====================================
@router.get("/recent")
def get_recent_activity(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    recent_watched = (
        db.query(ViewedMovie)
        .filter(ViewedMovie.user_id == current_user.id)
        .order_by(ViewedMovie.viewed_at.desc())
        .limit(5)
        .all()
    )

    recent_favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.id.desc())
        .limit(5)
        .all()
    )

    recent_reviews = (
        db.query(Review)
        .filter(Review.user_id == current_user.id)
        .order_by(Review.id.desc())
        .limit(5)
        .all()
    )

    return {
        "recent_watched": [
            {
                "title": item.movie_title,
                "poster": item.poster,
                "watched_date": item.viewed_at
            }
            for item in recent_watched
        ],

        "recent_favorites": [
            {
                "title": item.movie_title,
                "poster": item.poster
            }
            for item in recent_favorites
        ],

        "recent_reviews": [
            {
                "movie_title": item.movie_title,
                "rating": item.rating
            }
            for item in recent_reviews
        ]
    }