from pydantic import BaseModel
from typing import Optional


class WatchlistCreate(BaseModel):
    movie_id: str
    movie_title: str
    genre: Optional[str] = None
    poster: Optional[str] = None


class WatchlistResponse(BaseModel):
    id: int
    movie_id: str
    movie_title: str
    genre: Optional[str]
    poster: Optional[str]

    class Config:
        from_attributes = True