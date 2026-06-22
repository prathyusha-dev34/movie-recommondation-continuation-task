from fastapi import Depends, HTTPException

from app.auth import get_current_user


def admin_required(
    current_user=Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user