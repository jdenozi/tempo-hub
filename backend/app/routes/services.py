from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.service import Service
from app.models.permission import Permission
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate
from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=List[ServiceResponse])
def list_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les services avec flag is_accessible"""
    # Récupère tous les services actifs
    all_services = db.query(Service).filter(Service.is_active == True).all()

    # Admin a accès à tout
    if current_user.role.value == "admin":
        return [
            ServiceResponse(
                **{c.name: getattr(s, c.name) for c in s.__table__.columns},
                is_accessible=True
            )
            for s in all_services
        ]

    # Récupère les IDs des services accessibles par l'utilisateur
    permitted_service_ids = db.query(Permission.service_id).filter(
        Permission.user_id == current_user.id,
        Permission.can_access == True
    ).all()
    permitted_ids = {p[0] for p in permitted_service_ids}

    # Retourne tous les services avec le flag is_accessible
    return [
        ServiceResponse(
            **{c.name: getattr(s, c.name) for c in s.__table__.columns},
            is_accessible=(s.id in permitted_ids or s.is_public)
        )
        for s in all_services
    ]


@router.get("/all", response_model=List[ServiceResponse])
def list_all_services(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Liste tous les services (admin only)"""
    return db.query(Service).all()


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Crée un nouveau service (admin only)"""
    if db.query(Service).filter(Service.name == service_data.name).first():
        raise HTTPException(status_code=400, detail="Un service avec ce nom existe déjà")

    service = Service(**service_data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.patch("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Met à jour un service (admin only)"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")

    for field, value in service_data.model_dump(exclude_unset=True).items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Supprime un service (admin only)"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service non trouvé")

    db.delete(service)
    db.commit()
