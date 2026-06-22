from sqlalchemy.orm import Session

from app.models.search_history import SearchHistory


def save_search_history(
    db: Session,
    user_id: int,
    keyword: str
):
    """
    Save user search history
    """

    search = SearchHistory(
        user_id=user_id,
        keyword=keyword
    )

    db.add(search)
    db.commit()
    db.refresh(search)

    return search


def get_recent_searches(
    db: Session,
    user_id: int,
    limit: int = 10
):
    """
    Get latest searches for user
    """

    return (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == user_id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(limit)
        .all()
    )


def get_total_searches(
    db: Session,
    user_id: int
):
    """
    Count total searches
    """

    return (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == user_id
        )
        .count()
    )


def get_recent_search_keywords(
    db: Session,
    user_id: int,
    limit: int = 3
):
    """
    Latest search keywords only
    """

    searches = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == user_id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .limit(limit)
        .all()
    )

    return [item.keyword for item in searches]


def prevent_duplicate_consecutive_search(
    db: Session,
    user_id: int,
    keyword: str
):
    """
    Optional Enhancement:
    Skip saving if same keyword
    was searched last time.
    """

    latest_search = (
        db.query(SearchHistory)
        .filter(
            SearchHistory.user_id == user_id
        )
        .order_by(
            SearchHistory.searched_at.desc()
        )
        .first()
    )

    if (
        latest_search
        and latest_search.keyword.lower()
        == keyword.lower()
    ):
        return latest_search

    search = SearchHistory(
        user_id=user_id,
        keyword=keyword
    )

    db.add(search)
    db.commit()
    db.refresh(search)

    return search