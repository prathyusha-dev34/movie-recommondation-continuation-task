from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    description = Column(String(255), nullable=True)

    is_public = Column(
        Boolean,
        default=False,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="collections"
    )

    movies = relationship(
        "CollectionMovie",
        back_populates="collection",
        cascade="all, delete-orphan"
    )


class CollectionMovie(Base):
    __tablename__ = "collection_movies"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    collection_id = Column(
        Integer,
        ForeignKey("collections.id", ondelete="CASCADE"),
        nullable=False
    )

    movie_id = Column(
        String,
        nullable=False
    )

    movie_title = Column(
        String(255),
        nullable=False
    )

    poster_path = Column(
        String(255),
        nullable=True
    )

    collection = relationship(
        "Collection",
        back_populates="movies"
    )