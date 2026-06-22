from pydantic import BaseModel
 
 
# =========================
# ADMIN LOGIN
# =========================
class AdminLogin(BaseModel):
    username: str
    password: str
 
 
# =========================
# USER RESPONSE
# =========================
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
 
    class Config:
        from_attributes = True
 
 
# =========================
# REVIEW RESPONSE
# =========================
class ReviewResponse(BaseModel):
    id: int
    user_id: int
    movie_id: int
    rating: int
    comment: str
 
    class Config:
        from_attributes = True
 
 
# =========================
# DASHBOARD STATS
# =========================
class DashboardStats(BaseModel):
    total_users: int
    total_reviews: int
    total_favorites: int
    most_searched_movie: str
 