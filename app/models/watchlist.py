from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    movie_id = Column(
        String,
        nullable=False
    )

    movie_title = Column(
        String,
        nullable=False
    )

    genre = Column(
        String,
        nullable=True
    )

    poster = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="watchlist"
    )