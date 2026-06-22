from pydantic import BaseModel
from typing import Optional


class FavoriteCreate(BaseModel):
    movie_id: str
    movie_title: str
    poster: Optional[str] = None


class FavoriteResponse(BaseModel):
    id: int
    movie_id: str
    movie_title: str
    poster: Optional[str]

    class Config:
        from_attributes = True