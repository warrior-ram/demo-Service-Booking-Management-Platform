from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel

from app.core.database import get_session
from app.models.service import Service
from app.models.user import User
from app.api.deps import get_current_user, get_admin_user


router = APIRouter()


# Request/Response Schemas
class ServiceCreate(BaseModel):
    """Schema for creating a service"""
    name: str
    description: str | None = None
    duration_minutes: int
    price: float


class ServiceUpdate(BaseModel):
    """Schema for updating a service"""
    name: str | None = None
    description: str | None = None
    duration_minutes: int | None = None
    price: float | None = None
    is_active: bool | None = None


class ServiceResponse(BaseModel):
    """Schema for service response"""
    id: int
    name: str
    description: str | None
    duration_minutes: int
    price: float
    is_active: bool
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[ServiceResponse])
async def get_all_services(
    session: Session = Depends(get_session),
    active_only: bool = True
):
    """
    Get all services (public endpoint)
    
    - **active_only**: If True, only return active services
    """
    statement = select(Service)
    if active_only:
        statement = statement.where(Service.is_active == True)
    
    services = session.exec(statement).all()
    return services


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(
    service_id: int,
    session: Session = Depends(get_session)
):
    """
    Get a specific service by ID
    """
    service = session.get(Service, service_id)
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    return service


@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Create a new service (Admin only)
    
    - **name**: Service name
    - **description**: Optional description
    - **duration_minutes**: Duration in minutes
    - **price**: Service price
    """
    new_service = Service(
        name=service_data.name,
        description=service_data.description,
        duration_minutes=service_data.duration_minutes,
        price=service_data.price
    )
    
    session.add(new_service)
    session.commit()
    session.refresh(new_service)
    
    return new_service


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Update a service (Admin only)
    """
    service = session.get(Service, service_id)
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Update only provided fields
    update_data = service_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)
    
    session.add(service)
    session.commit()
    session.refresh(service)
    
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    service_id: int,
    session: Session = Depends(get_session),
    admin_user: User = Depends(get_admin_user)
):
    """
    Delete a service (Admin only)
    
    This performs a soft delete by setting is_active to False
    """
    service = session.get(Service, service_id)
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Soft delete
    service.is_active = False
    session.add(service)
    session.commit()
    
    return None
