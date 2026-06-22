from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import base1_schemas
from app.auth import get_current_user
from app.models.collection import Collection, CollectionMovie

router = APIRouter(
    prefix="/collections",
    tags=["Collections"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=base1_schemas.CollectionResponse)
def create_collection(
    collection: base1_schemas.CollectionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    new_collection = Collection(
        name=collection.name,
        description=collection.description,
        user_id=current_user.id,
    )

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    return new_collection


@router.get("/", response_model=list[base1_schemas.CollectionResponse])
def get_collections(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return (
        db.query(Collection)
        .filter(Collection.user_id == current_user.id)
        .all()
    )


@router.get("/{collection_id}", response_model=base1_schemas.CollectionResponse)
def get_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    collection = (
        db.query(Collection)
        .filter(
            Collection.id == collection_id,
            Collection.user_id == current_user.id,
        )
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    return collection


@router.put("/{collection_id}", response_model=base1_schemas.CollectionResponse)
def update_collection(
    collection_id: int,
    updated: base1_schemas.CollectionUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    collection = (
        db.query(Collection)
        .filter(
            Collection.id == collection_id,
            Collection.user_id == current_user.id,
        )
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    collection.name = updated.name
    collection.description = updated.description

    db.commit()
    db.refresh(collection)

    return collection


@router.delete("/{collection_id}")
def delete_collection(
    collection_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    collection = (
        db.query(Collection)
        .filter(
            Collection.id == collection_id,
            Collection.user_id == current_user.id,
        )
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    db.delete(collection)
    db.commit()

    return {"message": "Collection deleted successfully"}


@router.post("/{collection_id}/movies")
def add_movie(
    collection_id: int,
    movie: base1_schemas.MovieCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    collection = (
        db.query(Collection)
        .filter(
            Collection.id == collection_id,
            Collection.user_id == current_user.id,
        )
        .first()
    )

    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    new_movie = CollectionMovie(
        collection_id=collection.id,
        movie_id=movie.movie_id,
        movie_title=movie.movie_title,
        poster_path=movie.poster_path,
    )

    db.add(new_movie)
    db.commit()

    return {"message": "Movie added successfully"}


@router.delete("/{collection_id}/movies/{movie_id}")
def remove_movie(
    collection_id: int,
    movie_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    movie = (
        db.query(CollectionMovie)
        .join(Collection)
        .filter(
            Collection.id == collection_id,
            Collection.user_id == current_user.id,
            CollectionMovie.movie_id == movie_id,
        )
        .first()
    )

    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    db.delete(movie)
    db.commit()

    return {"message": "Movie removed successfully"}