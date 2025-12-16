from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr

from app.core.database import get_session
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.api.deps import get_current_user


router = APIRouter()


# Request/Response Schemas
class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    full_name: str


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (without password)"""
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """
    Register a new user
    
    - **email**: Valid email address (must be unique)
    - **password**: User password (will be hashed)
    - **full_name**: User's full name
    """
    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        full_name=user_data.full_name,
        role="customer"  # Default role
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=UserResponse)
async def login(
    user_credentials: UserLogin,
    response: Response,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and set HTTP-only cookie
    
    - **email**: User email
    - **password**: User password
    """
    # Find user by email
    statement = select(User).where(User.email == user_credentials.email)
    user = session.exec(statement).first()
    
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    # Set HTTP-only cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=1800,  # 30 minutes
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )
    
    return user


@router.post("/logout")
async def logout(response: Response):
    """
    Logout user by clearing the authentication cookie
    """
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information
    
    Requires valid authentication cookie
    """
    return current_user
