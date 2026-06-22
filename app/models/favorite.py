from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database import Base


class Favorite(Base):

    __tablename__ = "favorites"

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

    poster = Column(
        String,
        nullable=True
    )

    user = relationship(
        "User",
        back_populates="favorites"
    )