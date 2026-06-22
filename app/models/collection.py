from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import String
from app.database import Base


class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="collections")

    movies = relationship(
        "CollectionMovie",
        back_populates="collection",
        cascade="all, delete"
    )


class CollectionMovie(Base):
    __tablename__ = "collection_movies"

    id = Column(Integer, primary_key=True, index=True)

    collection_id = Column(
        Integer,
        ForeignKey("collections.id")
    )

    movie_id = Column(String)

    movie_title = Column(String(255))

    poster_path = Column(String(255))

    collection = relationship(
        "Collection",
        back_populates="movies"
    )