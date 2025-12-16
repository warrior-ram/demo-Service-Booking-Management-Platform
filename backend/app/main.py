from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import create_db_and_tables

# Import models to ensure they're registered with SQLModel
from app.models.user import User
from app.models.service import Service
from app.models.booking import Booking
from app.models.availability import Availability

# Import routers
from app.api.routes.auth import router as auth_router
from app.api.routes.services import router as services_router
from app.api.routes.bookings import router as bookings_router
from app.api.routes.availability import router as availability_router
from app.api.routes.admin import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Create database tables
    create_db_and_tables()
    print("[OK] Database tables created successfully")
    yield
    # Shutdown: Cleanup (if needed)
    print("Shutting down application")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="A comprehensive service booking management platform for coaching and consulting services",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(services_router, prefix="/services", tags=["Services"])
app.include_router(bookings_router, prefix="/bookings", tags=["Bookings"])
app.include_router(availability_router, prefix="/availability", tags=["Availability"])
app.include_router(admin_router, prefix="/admin", tags=["Admin Dashboard"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Service Booking Management Platform API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
