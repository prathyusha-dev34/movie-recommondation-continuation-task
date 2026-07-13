from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import Counter
from datetime import datetime
from dateutil.relativedelta import relativedelta

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

@router.get("")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return {
        "watched_count": db.query(ViewedMovie)
        .filter(ViewedMovie.user_id == current_user.id)
        .count(),

        "favorites_count": db.query(Favorite)
        .filter(Favorite.user_id == current_user.id)
        .count(),

        "watchlist_count": db.query(Watchlist)
        .filter(Watchlist.user_id == current_user.id)
        .count(),

        "reviews_count": db.query(Review)
        .filter(Review.user_id == current_user.id)
        .count(),

        "collections_count": db.query(Collection)
        .filter(Collection.user_id == current_user.id)
        .count(),

        "total_searches": db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .count(),
    }


# =====================================
# MONTHLY STATS (LAST 6 MONTHS)
# =====================================

@router.get("/monthly")
def get_monthly_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    today = datetime.now()

    months = []

    for i in range(5, -1, -1):
        month_date = today - relativedelta(months=i)

        months.append({
            "month": month_date.strftime("%b"),
            "year": month_date.year,
            "month_num": month_date.month,
            "count": 0
        })

    watched = (
        db.query(ViewedMovie)
        .filter(ViewedMovie.user_id == current_user.id)
        .all()
    )

    for movie in watched:
        if not movie.viewed_at:
            continue

        for month in months:
            if (
                movie.viewed_at.year == month["year"]
                and movie.viewed_at.month == month["month_num"]
            ):
                month["count"] += 1

    return [
        {
            "month": m["month"],
            "count": m["count"]
        }
        for m in months
    ]


# =====================================
# TOP 5 GENRES
# =====================================

@router.get("/genres")
def get_top_genres(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    watched_movies = (
        db.query(ViewedMovie.genre)
        .filter(ViewedMovie.user_id == current_user.id)
        .all()
    )

    genre_counter = Counter()

    for movie in watched_movies:
        if movie.genre:
            genres = [g.strip() for g in movie.genre.split(",")]
            genre_counter.update(genres)

    return [
        {
            "genre": genre,
            "count": count
        }
        for genre, count in genre_counter.most_common(5)
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