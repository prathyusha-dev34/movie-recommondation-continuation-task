from app.models.favorite import Favorite
from app.models.search_history import SearchHistory
from app.models.viewed_movie import ViewedMovie


SUPERHERO_MOVIES = [
    {
        "title": "The Dark Knight",
        "poster": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
        "title": "The Batman",
        "poster": "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"
    },
    {
        "title": "Man of Steel",
        "poster": "https://image.tmdb.org/t/p/w500/7rIPjn5TUK04O25ZkMyHrGNPgLx.jpg"
    },
    {
        "title": "Justice League",
        "poster": "https://image.tmdb.org/t/p/w500/eifGNCSDuxJeS1loAXil5bIGgvC.jpg"
    },
    {
        "title": "Wonder Woman",
        "poster": "https://image.tmdb.org/t/p/w500/v4ncgZjG2Zu8ZW5al1vIZTsSjqX.jpg"
    }
]

SCI_FI_MOVIES = [
    {
        "title": "Interstellar",
        "poster": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
        "title": "Inception",
        "poster": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg"
    },
    {
        "title": "Arrival",
        "poster": "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg"
    },
    {
        "title": "Blade Runner 2049",
        "poster": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg"
    },
    {
        "title": "The Martian",
        "poster": "https://image.tmdb.org/t/p/w500/5aGhaIHYuQbqlHWvWYqMCnj40y2.jpg"
    }
]

ACTION_MOVIES = [
    {
        "title": "John Wick",
        "poster": "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg"
    },
    {
        "title": "Mad Max: Fury Road",
        "poster": "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg"
    },
    {
        "title": "Mission Impossible",
        "poster": "https://image.tmdb.org/t/p/w500/l5uxY5m5OInWpcExIpKG6AR3rgL.jpg"
    },
    {
        "title": "Top Gun Maverick",
        "poster": "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg"
    }
]


def get_recommendations(db, user_id):

    recommendations = []

    searches = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == user_id)
        .all()
    )

    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .all()
    )

    viewed_movies = (
        db.query(ViewedMovie)
        .filter(ViewedMovie.user_id == user_id)
        .all()
    )

    keywords = []

    for search in searches:
        keywords.append(search.keyword.lower())

    for fav in favorites:
        keywords.append(fav.movie_title.lower())

    for movie in viewed_movies:
        keywords.append(movie.movie_title.lower())

    keyword_text = " ".join(keywords)

    if any(
        word in keyword_text
        for word in ["batman", "superman", "justice", "marvel", "dc"]
    ):
        for movie in SUPERHERO_MOVIES:
            recommendations.append({
                "title": movie["title"],
                "genre": "Action",
                "reason": "Based on your search history",
                "poster": movie["poster"]
            })

    if any(
        word in keyword_text
        for word in ["interstellar", "space", "sci-fi", "science"]
    ):
        for movie in SCI_FI_MOVIES:
            recommendations.append({
                "title": movie["title"],
                "genre": "Sci-Fi",
                "reason": "Based on your favorites",
                "poster": movie["poster"]
            })

    if any(
        word in keyword_text
        for word in ["action", "fight", "war"]
    ):
        for movie in ACTION_MOVIES:
            recommendations.append({
                "title": movie["title"],
                "genre": "Action",
                "reason": "Similar to movies you viewed",
                "poster": movie["poster"]
            })

    unique_movies = []
    seen_titles = set()

    for movie in recommendations:
        if movie["title"] not in seen_titles:
            seen_titles.add(movie["title"])
            unique_movies.append(movie)

    return unique_movies