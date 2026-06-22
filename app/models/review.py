from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    movie_id = Column(String, nullable=False)

    movie_title = Column(String)

    rating = Column(Integer)

    review = Column(String)

    user = relationship(
        "User",
        back_populates="reviews"
    )