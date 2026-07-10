from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


# =====================================================
# Movie Schemas
# =====================================================

class MovieCreate(BaseModel):
    movie_id: str
    movie_title: str
    poster_path: Optional[str] = None

    @field_validator("movie_id", mode="before")
    @classmethod
    def validate_movie_id(cls, value):
        if value is not None:
            return str(value)
        return value


class MovieResponse(MovieCreate):
    id: int

    class Config:
        from_attributes = True


# =====================================================
# Collection Schemas
# =====================================================

class CollectionBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_public: bool = False


class CollectionCreate(CollectionBase):

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("Collection name is required")

        return value


class CollectionUpdate(CollectionBase):

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("Collection name is required")

        return value


# =====================================================
# Collection Response
# =====================================================

class CollectionResponse(CollectionBase):
    id: int
    user_id: int
    created_at: datetime
    movies: List[MovieResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True


# =====================================================
# Public Collection Response
# =====================================================

class PublicCollectionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    owner_name: str
    movie_count: int
    created_at: datetime

    class Config:
        from_attributes = True