from pydantic import BaseModel


class ReviewCreate(BaseModel):
    movie_id: str
    movie_title: str
    rating: int
    review: str


class ReviewResponse(BaseModel):
    id: int
    movie_id: str
    movie_title: str
    rating: int
    review: str

    class Config:
        from_attributes = True