from fastapi import Depends, HTTPException, status, Cookie
from sqlmodel import Session, select
from typing import Optional, Annotated

from app.core.database import get_session
from app.core.security import decode_access_token
from app.models.user import User


async def get_current_user(
    access_token: Annotated[Optional[str], Cookie()] = None,
    session: Session = Depends(get_session)
) -> User:
    """
    Dependency to get the current authenticated user from JWT cookie
    
    Args:
        access_token: JWT token from HTTP-only cookie
        session: Database session
        
    Returns:
        Current authenticated User object
        
    Raises:
        HTTPException: 401 if token is missing or invalid
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Check if token exists
    if not access_token:
        raise credentials_exception
    
    # Decode token
    payload = decode_access_token(access_token)
    if payload is None:
        raise credentials_exception
    
    # Extract email from token
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    # Get user from database
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


async def get_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to verify the current user has admin role
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current user if they are an admin
        
    Raises:
        HTTPException: 403 if user is not an admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin access required."
        )
    
    return current_user
