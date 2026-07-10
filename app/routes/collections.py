from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app import base1_schemas
from app.auth import get_current_user
from app.database import SessionLocal
from app.models.collection import Collection, CollectionMovie
from app.models.user import User

router = APIRouter(
    prefix="/collections",
    tags=["Collections"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================================================
# CREATE COLLECTION
# ==========================================================

@router.post("/", response_model=base1_schemas.CollectionResponse)
def create_collection(
    collection: base1_schemas.CollectionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    duplicate = (
        db.query(Collection)
        .filter(
            Collection.user_id == current_user.id,
            Collection.name == collection.name,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Collection name already exists",
        )

    new_collection = Collection(
        name=collection.name,
        description=collection.description,
        is_public=collection.is_public,
        user_id=current_user.id,
    )

    db.add(new_collection)
    db.commit()
    db.refresh(new_collection)

    return new_collection


# ==========================================================
# GET MY COLLECTIONS
# ==========================================================

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


# ==========================================================
# PUBLIC COLLECTIONS
# ==========================================================

@router.get(
    "/public",
    response_model=list[base1_schemas.PublicCollectionResponse],
)
def get_public_collections(
    db: Session = Depends(get_db),
):

    collections = (
        db.query(Collection)
        .filter(Collection.is_public == True)
        .all()
    )

    response = []

    for collection in collections:
        response.append(
            base1_schemas.PublicCollectionResponse(
                id=collection.id,
                name=collection.name,
                description=collection.description,
                owner_name=collection.user.username,
                movie_count=len(collection.movies),
                created_at=collection.created_at,
            )
        )

    return response


# ==========================================================
# SEARCH PUBLIC COLLECTIONS
# ==========================================================

@router.get(
    "/search",
    response_model=list[base1_schemas.PublicCollectionResponse],
)
def search_collections(
    query: str,
    db: Session = Depends(get_db),
):

    collections = (
        db.query(Collection)
        .join(User)
        .filter(Collection.is_public == True)
        .filter(
            or_(
                Collection.name.ilike(f"%{query}%"),
                User.username.ilike(f"%{query}%"),
            )
        )
        .all()
    )

    response = []

    for collection in collections:
        response.append(
            base1_schemas.PublicCollectionResponse(
                id=collection.id,
                name=collection.name,
                description=collection.description,
                owner_name=collection.user.username,
                movie_count=len(collection.movies),
                created_at=collection.created_at,
            )
        )

    return response

# ==========================================================
# GET COLLECTION DETAILS
# ==========================================================

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
        raise HTTPException(
            status_code=404,
            detail="Collection not found",
        )

    return collection


# ==========================================================
# UPDATE COLLECTION
# ==========================================================

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
        raise HTTPException(
            status_code=404,
            detail="Collection not found",
        )

    duplicate = (
        db.query(Collection)
        .filter(
            Collection.user_id == current_user.id,
            Collection.name == updated.name,
            Collection.id != collection_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Collection name already exists",
        )

    collection.name = updated.name
    collection.description = updated.description
    collection.is_public = updated.is_public

    db.commit()
    db.refresh(collection)

    return collection


# ==========================================================
# DELETE COLLECTION
# ==========================================================

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
        raise HTTPException(
            status_code=404,
            detail="Collection not found",
        )

    db.delete(collection)
    db.commit()

    return {
        "message": "Collection deleted successfully"
    }


# ==========================================================
# ADD MOVIE TO COLLECTION
# ==========================================================

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
        raise HTTPException(
            status_code=404,
            detail="Collection not found",
        )

    duplicate_movie = (
        db.query(CollectionMovie)
        .filter(
            CollectionMovie.collection_id == collection.id,
            CollectionMovie.movie_id == movie.movie_id,
        )
        .first()
    )

    if duplicate_movie:
        raise HTTPException(
            status_code=400,
            detail="Movie already exists in this collection",
        )

    new_movie = CollectionMovie(
        collection_id=collection.id,
        movie_id=movie.movie_id,
        movie_title=movie.movie_title,
        poster_path=movie.poster_path,
    )

    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)

    return {
        "message": "Movie added successfully"
    }


# ==========================================================
# REMOVE MOVIE FROM COLLECTION
# ==========================================================

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
        raise HTTPException(
            status_code=404,
            detail="Movie not found",
        )

    db.delete(movie)
    db.commit()

    return {
        "message": "Movie removed successfully"
    }